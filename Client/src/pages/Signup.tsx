import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { H1, Paragraph } from "../components/ui/typography";
import { toast } from "sonner";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface Building {
  id: string;
  name: string;
}

export default function SignUp() {
    const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    buildingId: "",
    });

    //Gets possible buildings to enrol 
    // const [buildings, setBuildings] = useState<Building[]>([]);

    // useEffect(() => {
    //     axios
    //         .get("----api adress----")
    //         .then((res) => {
    //             setBuildings(res.data);
    //         })
    //         .catch((err) => {
    //             console.error("Error loading buildings:", err);
    //             toast("Failed to load buildings", {
    //             description: "Please try again later.",
    //             });
    //         });
    // }, []);

    const handleChange = (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
        ) => {
            setForm({ ...form, [e.target.name]: e.target.value });
        };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName) {
        toast("Name missing", {
        description: "Please enter your full name.",
        });
        return;
    }

    const emailIsValid = form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    if (!emailIsValid) {
        toast("Invalid email", {
        description: "Please enter a valid email address.",
        });
        return;
    }

    if (!form.buildingId) {
        toast("Select a building", {
        description: "Please choose your building.",
        });
        return;
    }

    if (form.password !== form.confirmPassword) {
        toast("Password mismatch", {
        description: "Passwords must match.",
        });
        return;
    }

    try {
        await axios.post("/api/signup", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        buildingId: form.buildingId,
        });

        toast("Account created", {
        description: "Welcome to CondoLink! You can now log in.",
        });

        setForm({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        buildingId: "",
        });
    } catch (error) {
        console.error("Signup error:", error);
        toast("Signup failed", {
        description: "Something went wrong. Please try again.",
        });
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
                <H1 className="text-deepTealBlue mb-6 text-center">Create Your Account</H1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="fullName" className="block mb-1 font-semibold">
                            Full Name
                        </Label>
                        <Input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Your full name"
                            className="w-full"
                            style={{ borderColor: "var(--color-deepTealBlue)" }}
                        />
                    </div>

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
                        <Label htmlFor="buildingId" className="block mb-1 font-semibold">
                            Your Building
                        </Label>
                        <select
                            id="buildingId"
                            name="buildingId"
                            value={form.buildingId}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-softAqua"
                            style={{ 
                                borderColor: "var(--color-deepTealBlue)", 
                                color:"var(--color-concreteGray)" 
                            }}
                        >
                        <option value="">Select your building</option>
                             {/*{buildings.map((building) => (
                                <option key={building.id} value={building.id}>
                                {building.name}
                                </option>
                            ))} */}
                        </select>
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
                            placeholder="Enter a strong password"
                            className="w-full"
                            style={{ borderColor: "var(--color-deepTealBlue)" }}
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="confirmPassword"
                            className="block mb-1 font-semibold"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Repeat your password"
                            className="w-full"
                            style={{ borderColor: "var(--color-deepTealBlue)" }}
                        />
                    </div>

                    <Button type="submit" className="w-full py-3 mt-2 text-base">
                        Sign Up
                    </Button>
                </form>

                <Paragraph className="mt-6 text-center text-color-concreteGray">
                    Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-condoBlue hover:text-deepTealBlue font-semibold transition"
                >
                    Log in here
                </Link>
                .
                </Paragraph>
            </div>              
        </main>

        <Footer />

    </div>
  );
}