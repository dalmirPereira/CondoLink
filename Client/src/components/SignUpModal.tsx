import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface Building {
    id: number;
    name: string;
}

interface Blocks {
    id: number;
    name: string;
    building_id: number;
}

interface SignUpModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userToEdit?: any; // 👈 optional for edit mode
}

export function SignUpModal({ open, onOpenChange, userToEdit }: SignUpModalProps) {
    const navigate = useNavigate();
    const { axiosInstance } = useAuth();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        buildingId: "",
        blockId: "",
        unit: "",
    });

    const [buildings, setBuildings] = useState<Building[]>([]);
    const [blocks, setBlocks] = useState<Blocks[]>([]);
    const isEditMode = !!userToEdit; // 👈 detect edit mode

    useEffect(() => {
        if (!open) return; // do nothing if modal is closed

        const fetchBuildings = async () => {
            try {
                const res = await axiosInstance.get("/buildings");
                setBuildings(res.data.buildings);
                setBlocks(res.data.blocks);
            } catch (err) {
                console.error("Error loading buildings:", err);
                toast("Failed to load buildings", {
                    description: "Please try again later.",
                });
            }
        };

        fetchBuildings();
    }, [open]);

    // Pre-fill form if editing
    useEffect(() => {
        if (isEditMode && userToEdit) {
            setForm({
                fullName: userToEdit.fullName || "",
                email: userToEdit.email || "",
                password: "",
                confirmPassword: "",
                buildingId: userToEdit.buildingId || "",
                blockId: userToEdit.blockId || "",
                unit: userToEdit.unit || "",
            });
        } else {
            // Reset form on modal open for create mode
            setForm({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                buildingId: "",
                blockId: "",
                unit: "",
            });
        }
    }, [isEditMode, userToEdit, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "buildingId" || name === "blockId"
                ? (value === "" ? "" : Number(value))
                : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.fullName || !form.email || !form.unit) {
            toast("Missing fields", { description: "Please fill out all required fields." });
            return;
        }

        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toast("Invalid email", { description: "Please enter a valid email address." });
            return;
        }

        if (!isEditMode && (!form.password || form.password !== form.confirmPassword)) {
            toast("Password issue", { description: "Passwords must match." });
            return;
        }

        const data: any = {
            fullName: form.fullName,
            email: form.email,
            buildingId: Number(form.buildingId),
            blockId: form.blockId ? Number(form.blockId) : null,
            unit: form.unit,
        };

        if (form.password) {
            data.password = form.password;
        }

        try {
            if (isEditMode) {
                // Update existing user
                await axiosInstance.put(`/admin/updateUser/${userToEdit.id}`, data, {
                    headers: { Authorization: `Bearer ${axiosInstance.defaults.headers.Authorization}` },
                });
                toast.success("Resident updated", {
                    description: "The resident’s details were updated successfully.",
                });
            } else {
                // Create new user
                await axiosInstance.post("/register/user", data);
                toast.success("Account created", {
                    description: "Your account was created. Wait for admin approval.",
                });
            }

            onOpenChange(false);
            navigate(0); // Reload to show changes
        } catch (error: any) {
            console.error("Error submitting form:", error);
            toast.error("Operation failed", {
                description:
                    error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md"
                style={{
                    backgroundColor: "var(--color-white)",
                    color: "var(--color-deepTealBlue)",
                }}>
                <DialogHeader>
                    <DialogTitle className="text-4xl">{isEditMode ? "Update Resident" : "Sign Up"}</DialogTitle>
                    <DialogDescription className="text-lg mb-4 text-muted-foreground">
                        {isEditMode ? "Modify resident details" : "Create your account"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label className="mb-2" htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Full name"
                            required
                        />
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <Label className="mb-2" htmlFor="buildingId">Building</Label>
                        <select
                            id="buildingId"
                            name="buildingId"
                            value={form.buildingId}
                            onChange={handleChange}
                            required
                            disabled={isEditMode}
                            className="w-full rounded-md border px-3 py-2 bg-white"
                        >
                            <option value="" disabled>Select building</option>
                            {buildings.map((building) => (
                                <option key={building.id} value={building.id}>
                                    {building.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {form.buildingId !== "" && blocks.filter(block => block.building_id === Number(form.buildingId)).length > 0 && (
                        <div>
                            <Label className="mb-2" htmlFor="blockId">Block</Label>
                            <select
                                id="blockId"
                                name="blockId"
                                value={form.blockId}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border px-3 py-2 bg-white"
                            >
                                <option value="" disabled>Select block</option>
                                {blocks
                                    .filter(block => block.building_id === Number(form.buildingId))
                                    .map(block => (
                                        <option key={block.id} value={block.id}>
                                            {block.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <Label className="mb-2" htmlFor="unit">Unit</Label>
                        <Input
                            id="unit"
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            placeholder="Unit number"
                            required
                        />
                    </div>

                    {!isEditMode && (
                        <>
                            <div>
                                <Label className="mb-2" htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Enter a strong password"
                                    required
                                />
                            </div>

                            <div>
                                <Label className="mb-2" htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat your password"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full">
                        {isEditMode ? "Update Resident" : "Sign Up"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
