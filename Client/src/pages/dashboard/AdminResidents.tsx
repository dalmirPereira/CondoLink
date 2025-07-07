import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { SignUpModal } from "../../components/SignUpModal"; // 👈 import modal

export default function DashboardHome() {
  const { dashboardData, setDashboardData } = useDashboard();
  const { auth, axiosInstance } = useAuth();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<number | "all">("all");
  const [editingUser, setEditingUser] = useState<any>(null); // 👈 to hold user for editing
  const [modalOpen, setModalOpen] = useState(false);

  const users = (dashboardData?.users || []).filter(user => user.roleCode === 1);
  const blocks = dashboardData?.blocks || [];

  // Approve user
  const handleApprove = async (userId: number, approvedBy: number) => {
    try {
      setApprovingId(userId);
      await axiosInstance.post(
        "/dashboard/admin/approveUser",
        { userId, approvedBy },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      // Update local context without re-fetching
      if (dashboardData) {
        const updatedUsers = dashboardData.users.map(user =>
          user.id === userId ? { ...user, approvedBy: auth.id } : user
        );
        setDashboardData({ ...dashboardData, users: updatedUsers });
        toast.success("Resident approved", {
          description: "The resident was approved successfully.",
        });
      }
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || "Failed to approve user.";
      toast.error("Approval failed", { description: serverMessage });
    } finally {
      setApprovingId(null);
    }
  };

  // Delete user
  const handleDelete = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this resident?")) return;

    try {
      await axiosInstance.delete(
        `/dashboard/admin/deleteUser/${userId}`,
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      if (dashboardData) {
        const updatedUsers = dashboardData.users.filter(user => user.id !== userId);
        setDashboardData({ ...dashboardData, users: updatedUsers });
        toast.success("Resident deleted", {
          description: "The resident was removed successfully.",
        });
      }
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || "Failed to delete user.";
      toast.error("Deletion failed", { description: serverMessage });
    }
  };

  // Open modal for editing user
  const handleEdit = (user: any) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();

    return users.filter(user => {
      const matchesSearch =
        !lowerTerm ||
        user.fullName.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm);

      const matchesBlock =
        selectedBlockId === "all" || user.blockId === selectedBlockId;

      return matchesSearch && matchesBlock;
    });
  }, [searchTerm, selectedBlockId, users]);

  return (
    <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-4">Residents</h1>
      <p className="text-base leading-relaxed mb-6">
        This is your central hub for managing residents.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        {/* Search input */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
        </div>

        {/* Block filter dropdown */}
        <div className="flex flex-col mt-4 sm:mt-0">
          <select
            value={selectedBlockId}
            onChange={e => setSelectedBlockId(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="border border-gray-300 rounded-md w-full"
          >
            <option value="all">All Blocks</option>
            {blocks.map(block => (
              <option key={block.id} value={block.id}>
                {block.name}
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
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Block</th>
                <th className="px-4 py-2 border">Unit</th>
                <th className="px-4 py-2 border">Approved</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => {
                const userBlock = blocks.find(block => block.id === user.blockId);
                const blockName = userBlock?.name || "Unknown";

                return (
                  <tr key={user.id}>
                    <td className="px-4 py-2 border">{user.fullName}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{blockName}</td>
                    <td className="px-4 py-2 border">{user.unit || "N/A"}</td>
                    <td className="px-4 py-2 border">
                      {user.approvedBy ? (
                        "Yes"
                      ) : (
                        <button
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                          onClick={() => handleApprove(user.id, auth.id)}
                          disabled={approvingId === user.id}
                        >
                          {approvingId === user.id ? "Approving..." : "Approve"}
                        </button>
                      )}
                    </td>

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
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Signup Modal for updating user */}
      <SignUpModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingUser(null); // reset when closed
        }}
        userToEdit={editingUser}
      />
    </div>
  );
}
