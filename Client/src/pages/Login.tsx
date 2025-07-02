import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { H1, Paragraph } from "../components/ui/typography";
import { toast } from "sonner";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { useAuth } from "../contexts/AuthContext"; 

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
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

        // Basic email validation
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
            setTimeout(() => navigate("/dashboard"), 1500);
        } else {
            toast("Login failed", { description: result.message || "Please try again." });
        }
        };

        return (
        <div className="w-full min-h-screen font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 py-10">
                <div
                    className="bg-white rounded-2xl shadow-md pt-10 pb-0 px-8 max-w-md w-full"
                    style={{
                        borderColor: "var(--color-softAqua)",
                        borderWidth: "2px",
                        color: "var(--color-deepTealBlue)"
                    }}
                >
                    <H1 className="text-deepTealBlue mb-6 text-center">Log In</H1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="block mb-1 font-semibold">
                                Email Address
                            </Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@example.com"
                                className="w-full"
                                style={{ borderColor: "var(--color-deepTealBlue)" }}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="block mb-1 font-semibold">
                                Password
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full"
                            style={{ borderColor: "var(--color-deepTealBlue)" }}
                            />
                        </div>

                        <Button type="submit" className="w-full py-3 mt-2 text-base">
                            Log In
                        </Button>
                    </form>

                    <Paragraph className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className=" text-sm text-condoBlue hover:text-deepTealBlue font-semibold transition"
                        >
                            Sign up here
                        </Link>
                    .
                    </Paragraph>
                </div>
            </main>

            <Footer />
        </div>
    );
}
