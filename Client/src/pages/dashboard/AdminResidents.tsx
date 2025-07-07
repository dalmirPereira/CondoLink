import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { SignUpModal } from "../../components/SignUpModal";

export default function DashboardHome() {
  const { dashboardData, setDashboardData } = useDashboard();
  const { auth, axiosInstance } = useAuth();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<number | "all">("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const users = (dashboardData?.users || []).filter(user => user.roleCode === 1);
  const blocks = dashboardData?.blocks || [];

  // Approve user
  const handleApprove = async (userId: number, approvedBy: number) => {
    try {
      setApprovingId(userId);
      await axiosInstance.post(
        "/admin/approveUser",
        { userId, approvedBy },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

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
        `/admin/deleteUser/${userId}`,
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

  // Filter users based on search term and block
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

  // Define DataTable columns
  const columns = [
    {
      name: "Name",
      selector: (row: any) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: "Block",
      selector: (row: any) => blocks.find(block => block.id === row.blockId)?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row: any) => row.unit || "N/A",
    },
    {
      name: "Approved",
      cell: (row: any) =>
        row.approvedBy ? (
          "Yes"
        ) : (
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleApprove(row.id, auth.id)}
            disabled={approvingId === row.id}
          >
            {approvingId === row.id ? "Approving..." : "Approve"}
          </Button>
        ),
    },
    {
      name: "Actions",
      width: "200px",
      cell: (row: any) => (
        <div className="flex gap-2 justify-center">
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
    <div
      className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto"
      style={{ color: "var(--color-deepTealBlue)" }}
    >
      <h1 className="text-3xl font-bold mb-4">Residents</h1>
      <p className="text-base leading-relaxed mb-6">
        This is your central hub for managing residents.
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
        />
        <select
          value={selectedBlockId}
          onChange={(e) =>
            setSelectedBlockId(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="border border-gray-300 rounded-md w-full sm:w-auto"
        >
          <option value="all">All Blocks</option>
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.name}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns.map(col => ({
          ...col,
          center: true,
          wrap: true,
        }))}
        data={filteredUsers}
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
              minHeight: "50px",
            },
          },
          headCells: {
            style: {
              backgroundColor: "var(--color-deepTealBlue)",
              color: "white",
              fontWeight: "600",
              fontSize: "12px",
              textTransform: "uppercase",
              textAlign: "center",
            },
          },
          cells: {
            style: {
              textAlign: "center",
              whiteSpace: "normal",
            },
          },
        }}
        noDataComponent={<p className="text-gray-600">No users found.</p>}
      />

      {/* Signup Modal for updating user */}
      <SignUpModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingUser(null);
        }}
        userToEdit={editingUser}
      />
    </div>
  );
}
