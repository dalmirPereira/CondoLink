import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../contexts/DashboardContext";

interface MaintenanceForm {
  id?: number; // optional id when editing
  task: string;
  buildingId: number;  // always from auth
  blockId: number | "";
  subcontractor: number | "";
  category: number | "";
  status: string;
  comment: string;
  dueTo: string; // ISO date string yyyy-mm-dd
}

interface MaintenanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceToEdit?: MaintenanceForm & { id: number } | null;
}

export function MaintenanceModal({ open, onOpenChange, maintenanceToEdit = null }: MaintenanceModalProps) {
  const { auth, axiosInstance } = useAuth();
  const { dashboardData, setDashboardData } = useDashboard();

  const buildings = dashboardData?.buildings || [];
  const blocks = dashboardData?.blocks || [];
  const subcontractors = dashboardData?.users.filter((u) => u.roleCode === 2) || [];
  const categories = dashboardData?.services || [];

  const initialFormState: MaintenanceForm = {
    task: "",
    buildingId: auth?.buildingId || 0,
    blockId: "",
    subcontractor: "",
    category: "",
    status: "Pending",
    comment: "",
    dueTo: "",
  };

  const [form, setForm] = useState<MaintenanceForm>(initialFormState);

  // When modal opens or maintenanceToEdit changes, set form data
  useEffect(() => {
    if (!open) {
      setForm(initialFormState);
    } else if (maintenanceToEdit) {
      setForm({
        id: maintenanceToEdit.id,
        task: maintenanceToEdit.task,
        buildingId: auth?.buildingId || 0,
        blockId: maintenanceToEdit.blockId,
        subcontractor: maintenanceToEdit.subcontractor ?? "",
        category: maintenanceToEdit.category,
        status: maintenanceToEdit.status,
        comment: maintenanceToEdit.comment ?? "",
        dueTo: maintenanceToEdit.dueTo,
      });
    } else {
      // If adding new, reset and ensure buildingId is set
      setForm((prev) => ({
        ...initialFormState,
        buildingId: auth?.buildingId || 0,
      }));
    }
  }, [open, maintenanceToEdit, auth?.buildingId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  // Filter subcontractors to those matching selected category
  const filteredSubs = subcontractors.filter(
    (sub) => sub.serviceType === Number(form.category)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.task.trim()) {
      toast("Task required", { description: "Please enter a maintenance task." });
      return;
    }
    if (form.blockId === "") {
      toast("Block required", { description: "Please select a block." });
      return;
    }
    if (form.category === "") {
      toast("Category required", { description: "Please select a category." });
      return;
    }
    if (!["Pending", "In Progress", "Completed"].includes(form.status)) {
      toast("Invalid status", { description: "Please select a valid status." });
      return;
    }

    try {
      let response: any;
      if (maintenanceToEdit) {
        // Update existing
        response = await axiosInstance.put(
          `/admin/updateMaintenance/${form.id}`,
          {
            ...form
          },
          { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
        );
      } else {
        // Add new
        response = await axiosInstance.post(
          "/admin/addMaintenance",
          {
            ...form
          },
          { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
        );
      }

      const updatedMaintenance = response.data.result;

      if (dashboardData) {
        let updatedList = [...(dashboardData.maintenance || [])];
        if (maintenanceToEdit) {
          // Replace the updated item
          updatedList = updatedList.map((m) =>
            m.id === updatedMaintenance.id ? updatedMaintenance : m
          );
        } else {
          // Add new item
          updatedList.push(updatedMaintenance);
        }

        setDashboardData({
          ...dashboardData,
          maintenance: updatedList,
        });
      }

      toast(
        maintenanceToEdit ? "Maintenance Updated" : "Maintenance Added",
        { description: maintenanceToEdit ? "Task updated successfully." : "Task added successfully." }
      );
      setForm(initialFormState);
      onOpenChange(false);
    } catch (err: any) {
      const serverMessage = err.response?.data?.message || "Failed to save maintenance.";
      toast("Error", { description: serverMessage });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: "var(--color-white)",
          color: "var(--color-deepTealBlue)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {maintenanceToEdit ? "Update Maintenance Task" : "New Maintenance Task"}
          </DialogTitle>
          <DialogDescription className="text-base mb-4 text-muted-foreground">
            Fill in the details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2" htmlFor="task">
              Task
            </Label>
            <Input
              id="task"
              name="task"
              value={form.task}
              onChange={handleChange}
              placeholder="Fix leaking pipe"
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="buildingId">
              Building
            </Label>
            <Input
              id="buildingId"
              name="buildingId"
              value={buildings.find((b) => b.id === form.buildingId)?.name || "Unknown"}
              disabled
              readOnly
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="blockId">
              Block
            </Label>
            <select
              id="blockId"
              name="blockId"
              value={form.blockId}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 w-full"
            >
              <option value="" disabled>
                Select Block
              </option>
              {blocks
                .filter((block) => block.building_id === form.buildingId)
                .map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="category">
              Category
            </Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 w-full"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="subcontractor">
              Subcontractor
            </Label>
            <select
              id="subcontractor"
              name="subcontractor"
              value={form.subcontractor}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              disabled={form.category === ""}
            >
              <option value="">None</option>
              {filteredSubs.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="status">
              Status
            </Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="border rounded px-2 py-1 w-full"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="dueTo">
              Due Date
            </Label>
            <Input type="date" id="dueTo" name="dueTo" value={form.dueTo} onChange={handleChange} />
          </div>

          <div>
            <Label className="mb-2" htmlFor="comment">
              Comment
            </Label>
            <textarea
              id="comment"
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Additional notes"
              className="border rounded px-2 py-1 w-full"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            {maintenanceToEdit ? "Update Maintenance Task" : "Add Maintenance Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
