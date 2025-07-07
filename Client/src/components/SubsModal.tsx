import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useDashboard } from "../contexts/DashboardContext";

interface SubcontractorForm {
    fullName: string;
    companyName: string;
    phone: string;
    email: string;
    serviceType: number | "";
    password: string; // required only when adding
}

interface SubsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    subToEdit?: any | null; // optional subcontractor to edit
}

export function SubsModal({ open, onOpenChange, subToEdit = null }: SubsModalProps) {
    const { auth, axiosInstance } = useAuth();
    const { dashboardData, setDashboardData } = useDashboard();

    const services = dashboardData?.services || [];

    const initialFormState: SubcontractorForm = {
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        serviceType: "",
        password: "",
    };

    const [form, setForm] = useState<SubcontractorForm>(initialFormState);

    // When subToEdit changes, update form state
    useEffect(() => {
        if (subToEdit) {
            setForm({
                fullName: subToEdit.fullName || "",
                companyName: subToEdit.companyName || "",
                phone: subToEdit.phone || "",
                email: subToEdit.email || "",
                serviceType: subToEdit.serviceType || "",
                password: "", // empty password (optional on update)
            });
        } else {
            setForm(initialFormState);
        }
    }, [subToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "serviceType" ? (value === "" ? "" : Number(value)) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast("Invalid email", { description: "Please enter a valid email address." });
            return;
        }

        if (!form.serviceType) {
            toast("Category required", { description: "Please select a category." });
            return;
        }

        // On add: password required, on edit: optional
        if (!subToEdit && !form.password) {
            toast("Password required", { description: "Please enter a password." });
            return;
        }

        try {
            if (subToEdit) {
                // Update existing subcontractor
                const response = await axiosInstance.put(
                    `/admin/updateSub/${subToEdit.id}`,
                    {
                        fullName: form.fullName,
                        companyName: form.companyName,
                        phone: form.phone,
                        email: form.email,
                        serviceType: form.serviceType,
                        ...(form.password ? { password: form.password } : {})
                    },
                    { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
                );

                const updatedUser = response.data.result;

                if (response.data.success) {
                    // Update user in context
                    if (dashboardData) {
                        setDashboardData({
                            ...dashboardData,
                            users: dashboardData.users.map(u =>
                                u.id === updatedUser.id ? updatedUser : u
                            ),
                        });
                    }

                    toast("Subcontractor updated", { description: "Update successful." });

                    setTimeout(() => {
                        onOpenChange(false);
                    }, 1500);
                } else {
                    toast("Update failed", { description: response.data.message || "Please try again." });
                }
            } else {
                // Add new subcontractor
                const response = await axiosInstance.post(
                    "/admin/addSub",
                    {
                        ...form,
                        userId: auth?.id,
                        buildingId: auth?.buildingId,
                    },
                    { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
                );

                const newUser = response.data.result;

                if (response.data.success) {
                    if (dashboardData) {
                        setDashboardData({
                            ...dashboardData,
                            users: [...dashboardData.users, newUser],
                        });
                    }

                    toast("Subcontractor added", { description: "Added with success." });

                    setTimeout(() => {
                        onOpenChange(false);
                    }, 1500);
                } else {
                    toast("Add failed", { description: response.data.message || "Please try again." });
                }
            }
        } catch (err: any) {
            const serverMessage = err.response?.data?.message || "Failed to save subcontractor.";
            toast("Error", { description: serverMessage });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" style={{
                backgroundColor: "var(--color-white)",
                color: "var(--color-deepTealBlue)",
            }}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {subToEdit ? "Update Subcontractor" : "Add New Subcontractor"}
                    </DialogTitle>
                    <DialogDescription className="text-base mb-4 text-muted-foreground">
                        Fill in the details below
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-1" htmlFor="fullName">Contact Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            placeholder="John Smith"
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="companyName">Company Name</Label>
                        <Input
                            id="companyName"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            required
                            placeholder="ABC Plumbing"
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            placeholder="+61 412 345 678"
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="email">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="contact@abcplumbing.com"
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="password">
                            Password {subToEdit ? "(leave blank to keep current)" : ""}
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            {...(!subToEdit && { required: true })}
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="serviceType">Category</Label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={form.serviceType}
                            onChange={handleChange}
                            required
                            className="border rounded px-2 py-1 w-full"
                        >
                            <option value="" disabled>Select Category</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button type="submit" className="w-full">
                        {subToEdit ? "Update Subcontractor" : "Add Subcontractor"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
