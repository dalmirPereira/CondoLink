import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { H1, Paragraph } from "../components/ui/typography";
import { toast } from 'sonner';;

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

interface Building {
    id: number;
    name: string;
}

interface Blocks {
    id: number;
    name: string;
    building_id: number
}

export default function SignUp() {
    const navigate = useNavigate();

    type FormData = {
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
        buildingId: number | "";
        blockId: number | "";
        unit: string;
    };

    const [form, setForm] = useState<FormData>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        buildingId: "",
        blockId: "",
        unit: "",
    });

    //Gets possible buildings and blocks to enrol 
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [blocks, setBlocks] = useState<Blocks[]>([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/buildings")
            .then((res) => {

                const buildings = res.data.buildings;
                const blocks = res.data.blocks;

                setBuildings(buildings);
                setBlocks(blocks);
            })
            .catch((err) => {
                console.error("Error loading buildings:", err);
                toast("Failed to load buildings", {
                    description: "Please try again later.",
                });
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "buildingId" || name === "blockId"
                ? (value === "" ? "" : Number(value))
                : value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        const emailIsValid = form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (!emailIsValid) {
            toast("Invalid email", {
                description: "Please enter a valid email address.",
            });
            return;
        }

        const data: any = {
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            buildingId: form.buildingId,
            unit: form.unit,
        };

        // Only add blockId if there are blocks for the building
        if (blocks.filter(block => block.building_id === form.buildingId).length > 0) {
            data.blockId = form.blockId;
        }

        try {
            await axios.post("http://localhost:3000/register/user", data);

            toast("Account created", {
                description: "Thanks for creating a account with us! Your building's Admin will check and approve your request.",
            });

            setForm({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                buildingId: "",
                blockId: "",
                unit: ""
            });

            navigate("/");

        } catch (error: any) {

            console.error("Signup error:", error);

            // Try to get the message from the API response
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            toast("Signup failed", {
                description: errorMessage,
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
                            {buildings.length === 0 ? (
                                <p>Loading buildings...</p>
                            ) : (
                                <select
                                    id="buildingId"
                                    name="buildingId"
                                    value={form.buildingId}
                                    onChange={handleChange}
                                    required
                                    className="text-gray-500 w-full rounded-md border px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-softAqua"
                                    style={{
                                        borderColor: "var(--color-deepTealBlue)",
                                    }}
                                >
                                    <option value="" disabled>Select your building</option>
                                    {buildings.map((building) => (
                                        <option key={building.id} value={building.id}>
                                            {building.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {form.buildingId !== "" && blocks.filter(block => block.building_id === form.buildingId).length > 0 && (
                            <div>
                                <Label htmlFor="blockId" className="block mb-1 font-semibold">
                                    Your Block
                                </Label>
                                <select
                                    id="blockId"
                                    name="blockId"
                                    value={form.blockId}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-softAqua"
                                    style={{
                                        borderColor: "var(--color-deepTealBlue)",
                                    }}
                                >
                                    <option value="" disabled>Select your block</option>

                                    {blocks
                                        .filter(block => block.building_id == form.buildingId)
                                        .map(block => (
                                            <option key={block.id} value={block.id}>
                                                {block.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="unit" className="block mb-1 font-semibold">
                                Unit
                            </Label>
                            <Input
                                type="text"
                                id="unit"
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                required
                                placeholder="unit number"
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