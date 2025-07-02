import { useState } from "react";
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
    serviceType: number;
    password: string;
}

interface SubsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SubsModal({ open, onOpenChange }: SubsModalProps) {

    const { auth, axiosInstance } = useAuth();
    const { dashboardData, setDashboardData } = useDashboard();

    const services = dashboardData?.services || [];

    const [form, setForm] = useState<SubcontractorForm>({
        fullName: "",
        companyName: "",
        phone: "",
        email: "",
        serviceType: 0,
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast("Invalid email", { description: "Please enter a valid email address." });
            return;
        }

        if (!form.password) {
            toast("Password required", { description: "Please enter a password." });
            return;
        }

        try {
            const response: any = await axiosInstance.post(
                "/dashboard/admin/addSub",
                {
                    ...form,
                    userId: auth?.id,
                    buildingId: auth?.buildingId,
                },
                { headers: { Authorization: `Bearer ${auth?.accessToken}` } }
            );

            const newUser = response.data.result;

            // Update local context without re-fetching
            if (dashboardData) {
                setDashboardData({
                    ...dashboardData,
                    users: [...dashboardData.users, newUser],
                });
            }

            if (response.data.success) {
                toast("Subcontractor", { description: "Added with success" });
                setTimeout(() => {
                    onOpenChange(false);
                }, 1500);
            } else {
                toast("Subcontractor failed", { description: "Please try again." });
            }

        } catch (err: any) {
            const serverMessage = err.response?.data?.message || "Failed to add new subcontrator.";
            alert(serverMessage);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" style={{
                backgroundColor: "var(--color-white)",
                color: "var(--color-deepTealBlue)",
            }}>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add New Subcontractor</DialogTitle>
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
                        <Label className="mb-1" htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="serviceType">Category</Label>
                        <select
                            id="serviceType"
                            name="serviceType"
                            value={form.serviceType}
                            onChange={e => setForm(prev => ({ ...prev, serviceType: Number(e.target.value) }))}
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
                        Add Subcontractor
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
