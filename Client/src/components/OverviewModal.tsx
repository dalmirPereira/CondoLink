import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useDashboard } from "../contexts/DashboardContext";
import { format, parseISO } from "date-fns";

interface Task {
  id: number;
  task: string;
  dueTo: string;
  status?: string;
  buildingId: number;
  blockId: number;
  subcontractor?: number;
}

interface OverviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  tasks: Task[];
}

export function OverviewModal({ open, onOpenChange, title, tasks }: OverviewModalProps) {
  const { dashboardData } = useDashboard();

  const buildings = dashboardData?.buildings || [];
  const blocks = dashboardData?.blocks || [];
  const users = dashboardData?.users || [];

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "dd/MM/yyyy");
    } catch {
      return "-";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        style={{
          backgroundColor: "var(--color-white)",
          color: "var(--color-deepTealBlue)",
          border: "1px solid var(--color-softAqua)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base mb-4 text-muted-foreground">
            {tasks.length} maintenance {tasks.length === 1 ? "task" : "tasks"} found
          </DialogDescription>
        </DialogHeader>
        
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available.</p>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.map((task) => {
              const building = buildings.find((b) => b.id === task.buildingId)?.name || "Unknown";
              const block = blocks.find((b) => b.id === task.blockId)?.name || "Unknown";
              const subcontractorName = users.find((u) => u.id === task.subcontractor)?.fullName || "Unknown";

              return (
                <li
                  key={task.id}
                  className="p-3 border rounded shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <p className="font-semibold">{task.task}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Building:</span> {building} |{" "}
                    <span className="font-medium">Block:</span> {block}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Due Date:</span> {formatDate(task.dueTo)} |{" "}
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs ${task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {task.status || "Pending"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Subcontractor:</span> {subcontractorName}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}
