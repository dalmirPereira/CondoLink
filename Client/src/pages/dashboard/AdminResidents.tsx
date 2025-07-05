import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext"; // to get axios/token
import { useState, useMemo } from "react";


export default function DashboardHome() {

  const { dashboardData, setDashboardData } = useDashboard();
  const { auth, axiosInstance } = useAuth();
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<number | "all">("all");

  const users = (dashboardData?.users || []).filter(user => user.roleCode === 1);
  const blocks = dashboardData?.blocks || [];

  //API call to approve user
  const handleApprove = async (userId: number, approvedBy: number) => {
    try {
      setApprovingId(userId);
      await axiosInstance.post(
        "/dashboard/admin/approveUser",
        { userId, approvedBy },
        { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
      );

      //Update local context without re-fetching
      if (dashboardData) {
        const updatedUser = dashboardData.users.map(user =>
          user.id === userId ? { ...user, approvedBy: auth.id } : user
        );

        setDashboardData({ ...dashboardData, users: updatedUser });
      }

    } catch (err: any) {
      const serverMessage = err.response?.data?.message || "Failed to approve user.";
      alert(serverMessage);
    } finally {
      setApprovingId(null);
    }
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
    <div className="p-6 rounded-lg bg-white shadow-md" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-4">Residents</h1>
      <p className="text-base leading-relaxed mb-6">
        This is your central hub for managing residents.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        {/* Search input with label */}
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
          />
        </div>

        {/* Block filter dropdown with label */}
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
        <div className="rounded-md" style={{ border: "3px solid var(--color-softAqua)" }}>
          <table className="min-w-full border text-sm shadow-sm rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Block</th>
                <th className="px-4 py-2 border">Approved</th>
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
                    <td className="px-4 py-2 border">
                      {user.approvedBy ? ("Yes") : (
                        <button
                          className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                          onClick={() => handleApprove(user.id, auth.id)}
                          disabled={approvingId === user.id}
                        >
                          {approvingId === user.id ? "Approving..." : "Approve"}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}