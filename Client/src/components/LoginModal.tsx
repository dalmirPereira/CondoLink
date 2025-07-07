import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

interface LoginForm {
    email: string;
    password: string;
}
interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<LoginForm>({
        email: "",
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
            toast("Password required", { description: "Please enter your password." });
            return;
        }

        const result = await login(form);
        
        if (result.success) {
            toast("Login successful", { description: "Welcome back!" });
            setTimeout(() => {
                onOpenChange(false);
                // Navigate based on roleCode
                if (result.roleCode === 3) {
                    navigate("/dashboard/admin"); // Admin
                } else if (result.roleCode === 2) {
                    navigate("/dashboard/subs"); // Manager
                } else {
                    navigate("/dashboard/resident"); // Resident (default)
                }
            }, 1500);
        } else {
            toast("Login failed", { description: result.message || "Please try again." });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md"
                style={{
                    backgroundColor: "var(--color-white)",       // reference white from CSS variable
                    color: "var(--color-deepTealBlue)",          // reference deepTealBlue from CSS variable
                }}>
                <DialogHeader>
                    <DialogTitle className="text-4xl">Log In</DialogTitle>
                    <DialogDescription className="text-lg mb-4 text-muted-foreground">
                        Access your account
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div>
                        <Label htmlFor="email" className="mb-2">Email Address</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-2">Password</Label>
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

                    <Button type="submit" className="w-full">
                        Log In
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
