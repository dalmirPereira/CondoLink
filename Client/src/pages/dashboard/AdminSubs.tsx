import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import { SubsModal } from '../../components/SubsModal';
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function DashboardHome() {

  const { dashboardData, setDashboardData } = useDashboard();
  const { axiosInstance, auth } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<number | "all">("all");
  const [subsOpen, setSubsOpen] = useState(false); //SubsModal
  const [editSub, setEditSub] = useState<any>(null); // for passing to modal on update

  const users = (dashboardData?.users || []).filter(user => user.roleCode === 2);
  const services = dashboardData?.services || [];

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();

    return users.filter(user => {
      const matchesSearch =
        !lowerTerm ||
        user.fullName.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        user.companyName.toLowerCase().includes(lowerTerm);

      const matchesCategory =
        selectedService === "all" || user.serviceType === selectedService;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedService, users]);

  // Delete subcontractor
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcontractor?")) return;

    try {
      const response = await axiosInstance.delete(`/dashboard/admin/deleteUser/${id}`,
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      if (response.data.success) {
        // Remove deleted subcontractor from dashboard data state
        setDashboardData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            users: (prev.users || []).filter((u) => u.id !== id),
          };
        });
      } else {
        alert("Failed to delete subcontractor.");
      }

      toast.success("Subcontractor deleted", {
        description: "Subcontractor removed successfully.",
      });

    } catch (error) {
      alert("Error deleting subcontractor.");
      console.error(error);
    }
  };

  // Edit subcontractor
  const handleEdit = (sub: any) => {
    setEditSub(sub);
    setSubsOpen(true);
  };

  // When modal closes reset editSub
  const handleModalClose = (open: boolean) => {
    if (!open) setEditSub(null);
    setSubsOpen(open);
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-4">Subcontractors</h1>
      <p className="text-base leading-relaxed mb-6">
        This is your central hub for managing subcontractors.
      </p>

      <Button className="mb-6 mt-2" onClick={() => setSubsOpen(true)}>Add New Subcontractor</Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        {/* Search input with label */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Search by name, email or company name"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
        </div>

        {/* Category filter dropdown */}
        <div className="flex flex-col mt-4 sm:mt-0">
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border border-gray-300 rounded-md w-full"
          >
            <option value="all">All Categories</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-sm text-gray-600">No users found.</p>
      ) : (
        <div className="rounded-md min-w-0 overflow-auto" style={{ border: "3px solid var(--color-softAqua)", maxHeight: "500px" }}>
          <table className="min-w-full border text-center text-sm shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 border">Contact</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => {
                const userCategory = services.find(service => service.id === user.serviceType);
                const category = userCategory?.name || "Unknown";

                return (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">{user.fullName}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.companyName}</td>
                    <td className="px-4 py-2 border">{user.phone}</td>
                    <td className="px-4 py-2 border">{category}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" style={{ backgroundColor: "#facc15" }} onClick={() => handleEdit(user)}>
                          Update
                        </Button>
                        <Button size="sm" style={{ backgroundColor: "#ef4444" }} onClick={() => handleDelete(user.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <SubsModal open={subsOpen} onOpenChange={handleModalClose} subToEdit={editSub} />
    </div>
  );
}
