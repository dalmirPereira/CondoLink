import { Link } from "react-router-dom";
import { H1, Paragraph } from "../components/ui/typography";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Unauthorized() {
    return (
        <div className="w-full min-h-screen bg-neutralWhite text-deepTealBlue font-sans flex flex-col">

            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-20 bg-color-deepTealBlue text-neutral-white">
                <div className="max-w-2xl space-y-6 animate-fade-in">
                    <H1 className="text-4xl md:text-5xl font-bold leading-tight">
                        403 - Access Denied
                    </H1>

                    <Paragraph className="text-lg md:text-xl text-color-concreteGray">
                        You don't have permission to view this page.<br />
                        Please contact your building’s administrator if you believe this is a mistake.
                    </Paragraph>

                    <Link to="/">
                        <Button className="mt-4 px-6 py-3 text-lg shadow-md hover:shadow-lg transition">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
