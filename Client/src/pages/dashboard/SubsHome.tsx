import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { format, parseISO } from "date-fns";

export default function SubcontractorHome() {
    const { dashboardData } = useDashboard();
    const { auth } = useAuth();

    const maintenanceTasks = dashboardData?.maintenance || [];
    const blocks = dashboardData?.blocks || [];
    const categories = dashboardData?.services || [];

    // format date as dd/MM/yyyy
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "-";
        try {
            return format(parseISO(dateStr), "dd/MM/yyyy");
        } catch {
            return "-";
        }
    };

    // filter tasks assigned to current subcontractor
    const assignedTasks = useMemo(() =>
        maintenanceTasks.filter(task => task.subcontractor === auth?.id),
        [maintenanceTasks, auth?.id]
    );

    const columns = [
        {
            name: "Task",
            selector: (row: any) => row.task,
            sortable: true,
            minWidth: "180px"
        },
        {
            name: "Building",
            selector: (row: any) =>
                dashboardData?.buildings.find(b => b.id === row.buildingId)?.name || "Unknown",
            sortable: true,
        },
        {
            name: "Block",
            selector: (row: any) =>
                blocks.find(b => b.id === row.blockId)?.name || "Unknown",
            sortable: true,
        },
        {
            name: "Category",
            selector: (row: any) =>
                categories.find(c => c.id === row.category)?.name || "Unknown",
            sortable: true,
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
            sortable: true,
        },
    ];

    return (
        <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
            <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
            <p className="text-base leading-relaxed mb-6">
                Here are the maintenance tasks assigned to you.
            </p>

            {assignedTasks.length === 0 ? (
                <p className="text-sm text-gray-600">No maintenance tasks assigned.</p>
            ) : (
                <DataTable
                    columns={columns.map(col => ({
                        ...col,
                        center: true,
                        wrap: true,
                    }))}
                    data={assignedTasks}
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
                                fontSize: "10px",
                                textTransform: "uppercase",
                            },
                        },
                        cells: {
                            style: {
                                textAlign: "center",
                                whiteSpace: "normal",
                            }
                        }
                    }}
                />
            )}
        </div>
    );
}
