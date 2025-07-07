import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { SubsModal } from "../../components/SubsModal";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function DashboardHome() {
  const { dashboardData, setDashboardData } = useDashboard();
  const { axiosInstance, auth } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<number | "all">("all");
  const [subsOpen, setSubsOpen] = useState(false);
  const [editSub, setEditSub] = useState<any>(null);

  const users = (dashboardData?.users || []).filter(user => user.roleCode === 2);
  const services = dashboardData?.services || [];

  // Filter subcontractors based on search and category
  const filteredUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase().trim();

    return users.filter(user => {
      const matchesSearch =
        !lowerTerm ||
        user.fullName.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        (user.companyName?.toLowerCase().includes(lowerTerm) ?? false);

      const matchesCategory =
        selectedService === "all" || user.serviceType === selectedService;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedService, users]);

  // Delete subcontractor handler
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subcontractor?")) return;

    try {
      const response = await axiosInstance.delete(`/admin/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });

      if (response.data.success) {
        setDashboardData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            users: prev.users.filter(u => u.id !== id),
          };
        });
        toast.success("Subcontractor deleted", {
          description: "Subcontractor removed successfully.",
        });
      } else {
        alert("Failed to delete subcontractor.");
      }
    } catch (error) {
      alert("Error deleting subcontractor.");
      console.error(error);
    }
  };

  // Edit subcontractor handler
  const handleEdit = (sub: any) => {
    setEditSub(sub);
    setSubsOpen(true);
  };

  // Modal close handler
  const handleModalClose = (open: boolean) => {
    if (!open) setEditSub(null);
    setSubsOpen(open);
  };

  // DataTable columns config
  const columns = [
    {
      name: "Contact",
      selector: (row: any) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
    },
    {
      name: "Company",
      selector: (row: any) => row.companyName || "N/A",
    },
    {
      name: "Phone",
      selector: (row: any) => row.phone || "N/A",
    },
    {
      name: "Category",
      selector: (row: any) => {
        const cat = services.find(service => service.id === row.serviceType);
        return cat?.name || "Unknown";
      },
      sortable: true,
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
      <h1 className="text-3xl font-bold mb-4">Subcontractors</h1>
      <p className="text-base leading-relaxed mb-6">
        This is your central hub for managing subcontractors.
      </p>

      <Button className="mb-6 mt-2" onClick={() => setSubsOpen(true)}>
        Add New Subcontractor
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, email or company name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md w-full sm:w-64"
        />

        <select
          value={selectedService}
          onChange={e => setSelectedService(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="border border-gray-300 rounded-md w-full sm:w-auto mt-4 sm:mt-0"
        >
          <option value="all">All Categories</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
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

      <SubsModal open={subsOpen} onOpenChange={handleModalClose} subToEdit={editSub} />
    </div>
  );
}
