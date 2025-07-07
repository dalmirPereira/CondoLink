import { useState } from "react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { OverviewModal } from "../../components/OverviewModal";
import { isBefore, isThisMonth, isSameMonth, addMonths, parseISO, getYear, getMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

interface MaintenanceTask {
  id: number;
  task: string;
  dueTo: string;
  status: "Pending" | "In Progress" | "Completed" | string;
  [key: string]: any;
}

interface ChartDataItem {
  month: string;
  Pending: number;
  "In Progress": number;
  Completed: number;
}

export default function MaintenanceDashboard() {
  const { dashboardData } = useDashboard();
  const { auth } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTasks, setModalTasks] = useState<MaintenanceTask[]>([]);

  const maintenanceTasks: MaintenanceTask[] = (dashboardData?.maintenance || []).filter(
    (task) => task.blockId === auth?.blockId
  );

  const isNextMonth = (date: Date) => isSameMonth(date, addMonths(new Date(), 1));

  const pastDue = maintenanceTasks.filter(
    (task) => task.dueTo && isBefore(parseISO(task.dueTo), new Date()) && task.status !== "Completed"
  );
  const dueThisMonth = maintenanceTasks.filter(
    (task) => task.dueTo && isThisMonth(parseISO(task.dueTo))
  );
  const dueNextMonth = maintenanceTasks.filter(
    (task) => task.dueTo && isNextMonth(parseISO(task.dueTo))
  );

  const handleCardClick = (title: string, tasks: MaintenanceTask[]) => {
    if (tasks.length === 0) return;
    setModalTitle(title);
    setModalTasks(tasks);
    setModalOpen(true);
  };

  //Setting the data for the chart
  const currentYear = new Date().getFullYear();
  const chartData: ChartDataItem[] = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(currentYear, i).toLocaleString("default", { month: "short" }),
    Pending: 0,
    "In Progress": 0,
    Completed: 0,
  }));

  maintenanceTasks.forEach((task) => {
    if (!task.dueTo) return;
    const taskDate = parseISO(task.dueTo);
    if (getYear(taskDate) !== currentYear) return;
    const monthIndex = getMonth(taskDate);
    const status = task.status || "Pending";

    if (chartData[monthIndex][status] !== undefined) {
      chartData[monthIndex][status]++;
    } else {
      chartData[monthIndex]["Pending"]++;
    }
  });

  return (
    <div className="p-6 rounded-lg bg-white shadow-md min-w-0 overflow-auto" style={{ color: "var(--color-deepTealBlue)" }}>
      <h1 className="text-3xl font-bold mb-6">{dashboardData?.buildings[0]?.name} Overview</h1>
      <p className="text-base text-bold leading-relaxed mb-6">
        {dashboardData?.blocks.find((block) => block.id = auth.blockId)?.name}
      </p>
      {/* Maintenance Summary */}
      <h2 className="text-2xl mb-4" style={{ color: "var(--color-softAqua)" }}>Maintenance Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className=" border-l-4 shadow cursor-pointer hover:scale-102 transition-transform"
          onClick={() => handleCardClick("Past Due Maintenances", pastDue)}>
          <CardHeader>
            <CardTitle>Past Due</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{pastDue.length}</p>
            <p className="text-gray-500">Pending from previous dates</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 shadow cursor-pointer hover:scale-102 transition-transform"
          onClick={() => handleCardClick("Maintenances Due This Month", dueThisMonth)}>
          <CardHeader>
            <CardTitle>Due This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dueThisMonth.length}</p>
            <p className="text-gray-500">Scheduled for current month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 shadow cursor-pointer hover:scale-102 transition-transform"
          onClick={() => handleCardClick("Maintenances Due Next Month", dueNextMonth)}>
          <CardHeader>
            <CardTitle>Due Next Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{dueNextMonth.length}</p>
            <p className="text-gray-500">Planned for next month</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" stackId="a" fill="#f87171" />
            <Bar dataKey="In Progress" stackId="a" fill="#fbbf24" />
            <Bar dataKey="Completed" stackId="a" fill="#34d399" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overview Modal */}
      <OverviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
        tasks={modalTasks}
      />
    </div>
  );
}
