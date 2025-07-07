import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
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
  const [selectedStatus, setSelectedStatus] = useState<string | "all">("all");  // <-- NEW state for status filter
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);

  const maintenanceTasks = dashboardData?.maintenance || [];
  const blocks = dashboardData?.blocks || [];
  const categories = dashboardData?.services || [];

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  };

  const allStatuses = Array.from(
    new Set(
      maintenanceTasks
        .map((task) => task.status || "Pending")
        .filter(Boolean)
    )
  ).sort();

  const filteredTasks = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();
    return maintenanceTasks.filter((task) => {
      const status = task.status || "Pending";

      const matchesSearch =
        !lowerTerm ||
        task.task.toLowerCase().includes(lowerTerm) ||
        status.toLowerCase().includes(lowerTerm) ||
        (task.comment?.toLowerCase().includes(lowerTerm) ?? false);

      const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
      const matchesBlock = selectedBlock === "all" || task.blockId === selectedBlock;
      const matchesStatus = selectedStatus === "all" || status === selectedStatus;

      return matchesSearch && matchesCategory && matchesBlock && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedBlock, selectedStatus, maintenanceTasks]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this maintenance task?")) return;
    try {
      const response = await axiosInstance.delete(`/admin/deleteMaintenance/${id}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      if (response.data.success) {
        setDashboardData((prev) =>
          prev
            ? { ...prev, maintenance: prev.maintenance.filter((t) => t.id !== id) }
            : prev
        );
        toast.success("Maintenance deleted", {
          description: "Maintenance task removed successfully.",
        });
      } else {
        alert("Failed to delete maintenance task.");
      }
    } catch (error) {
      alert("Error deleting maintenance task.");
      console.error(error);
    }
  };

  const handleEdit = (task: any) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) setEditTask(null);
    setModalOpen(open);
  };

  const columns = [
    {
      name: "Task",
      selector: (row: any) => row.task,
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Building",
      selector: (row: any) =>
        dashboardData?.buildings.find((b) => b.id === row.buildingId)?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: any) =>
        blocks.find((b) => b.id === row.blockId)?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Category",
      selector: (row: any) =>
        categories.find((c) => c.id === row.category)?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Subcontractor",
      selector: (row: any) =>
        dashboardData?.users.find((u) => u.id === row.subcontractor)?.fullName || "None",
      minWidth: "120px"
    },
    {
      name: "Status",
      selector: (row: any) => row.status || "Pending",
    },
    {
      name: "Due Date",
      selector: (row: any) => formatDate(row.dueTo),
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row: any) => formatDate(row.created_at),
    },
    {
      name: "Actions",
      width: "200px",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" style={{ backgroundColor: "#facc15" }} onClick={() => handleEdit(row)}>
            Update
          </Button>
          <Button size="sm" style={{ backgroundColor: "#ef4444" }} onClick={() => handleDelete(row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-4">Maintenance</h1>
      <Button className="mb-4" onClick={() => setModalOpen(true)}>
        Add New Maintenance Task
      </Button>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-full sm:w-64"
        />
        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={selectedBlock}
          onChange={(e) =>
            setSelectedBlock(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="all">All Blocks</option>
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name}
            </option>
          ))}
        </select>

        {/* New Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        >
          <option value="all">All Statuses</option>
          {allStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns.map((col) => ({
          ...col,
          center: true,
          wrap: true,
        }))}
        data={filteredTasks}
        pagination
        highlightOnHover
        striped
        responsive
        fixedHeader
        fixedHeaderScrollHeight="52vh"
        customStyles={{
          tableWrapper: {
            style: {
              overflowY: "auto",
              border: "3px solid var(--color-softAqua)",
              borderRadius: "0.5rem",
            },
          },
          rows: {
            style: {
              minHeight: "50px"
            },
          },
          headCells: {
            style: {
              backgroundColor: "var(--color-deepTealBlue)",
              color: "white",
              fontWeight: "600",
              fontSize: "10px",
              textTransform: "uppercase",
            },
          }
        }}
      />

      <MaintenanceModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        maintenanceToEdit={editTask}
      />
    </div>
  );
}
