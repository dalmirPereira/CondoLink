import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import { MaintenanceModal } from "../../components/MaintenanceModal";
import { Button } from "../../components/ui/button";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function MaintenanceAdmin() {
  const { dashboardData, setDashboardData } = useDashboard();
  const { axiosInstance, auth } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [selectedBlock, setSelectedBlock] = useState<number | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null); // for passing to modal on update

  const maintenanceTasks = dashboardData?.maintenance || [];
  const blocks = dashboardData?.blocks || [];
  const categories = dashboardData?.services || [];

  // Format ISO date string to dd/MM/yyyy using date-fns
  function formatDate(dateStr: string | undefined) {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  }

  // Filter maintenance tasks
  const filteredTasks = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();

    return maintenanceTasks.filter((task) => {
      const matchesSearch =
        !lowerTerm ||
        task.task.toLowerCase().includes(lowerTerm) ||
        task.status?.toLowerCase().includes(lowerTerm) ||
        task.comment?.toLowerCase().includes(lowerTerm);

      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;

      const matchesBlock = selectedBlock === "all" || task.blockId === selectedBlock;

      return matchesSearch && matchesCategory && matchesBlock;
    });
  }, [searchTerm, selectedCategory, selectedBlock, maintenanceTasks]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this maintenance task?")) return;

    try {
      const response = await axiosInstance.delete(`/dashboard/admin/deleteMaintenance/${id}`,
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      if (response.data.success) {
        // Remove deleted task from dashboard data state
        setDashboardData((prev) => {
          if (!prev) return prev; // or return some initial state if you prefer

          return {
            ...prev,
            maintenance: (prev.maintenance || []).filter((t) => t.id !== id),
          };
        });
      } else {
        alert("Failed to delete maintenance task.");
      }

      toast.success("Maintenance deleted", {
        description: "Maintenance task removed successfully.",
      });

    } catch (error) {
      alert("Error deleting maintenance task.");
      console.error(error);
    }
  };

  const handleEdit = (task: any) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // When modal closes reset editTask
  const handleModalClose = (open: boolean) => {
    if (!open) setEditTask(null);
    setModalOpen(open);
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-4">Maintenance</h1>
      <p className="text-base leading-relaxed mb-6">
        View and manage all maintenance tasks for your buildings.
      </p>

      <Button className="mb-6 mt-2" onClick={() => setModalOpen(true)}>
        Add New Maintenance Task
      </Button>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Search by task, status, or comment"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
        </div>

        <div className="flex flex-col mt-4 sm:mt-0">
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-md w-full"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mt-4 sm:mt-0">
          <select
            value={selectedBlock}
            onChange={(e) =>
              setSelectedBlock(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-md w-full"
          >
            <option value="all">All Blocks</option>
            {blocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Maintenance Table */}
      {filteredTasks.length === 0 ? (
        <p className="text-sm text-gray-600">No maintenance tasks found.</p>
      ) : (
        <div className="rounded-md min-w-0 overflow-auto" style={{ border: "3px solid var(--color-softAqua)", maxHeight: "500px" }}>
          <table className="min-w-full border text-center text-sm shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 border">Task</th>
                <th className="px-4 py-2 border">Building</th>
                <th className="px-4 py-2 border">Block</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Subcontractor</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const category = categories.find((c) => c.id === task.category)?.name || "Unknown";
                const block = blocks.find((b) => b.id === task.blockId)?.name || "Unknown";
                const building = dashboardData?.buildings.find((b) => b.id === task.buildingId)?.name || "Unknown";
                const subcontractor = dashboardData?.users.find((u) => u.id === task.subcontractor)?.fullName || "None";
                return (
                  <tr key={task.id}>
                    <td className="px-4 py-2 border">{task.task}</td>
                    <td className="px-4 py-2 border">{building}</td>
                    <td className="px-4 py-2 border">{block}</td>
                    <td className="px-4 py-2 border">{category}</td>
                    <td className="px-4 py-2 border">{subcontractor}</td>
                    <td className="px-4 py-2 border">{task.status || "Pending"}</td>
                    <td className="px-4 py-2 border">{formatDate(task.dueTo)}</td>
                    <td className="px-4 py-2 border">{formatDate(task.created_at)}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" style={{ backgroundColor: "#facc15" }} onClick={() => handleEdit(task)}>
                          Update
                        </Button>
                        <Button size="sm" style={{ backgroundColor: "#ef4444" }} onClick={() => handleDelete(task.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Maintenance Modal */}
      <MaintenanceModal open={modalOpen} onOpenChange={handleModalClose} maintenanceToEdit={editTask} />
    </div>
  );
}
