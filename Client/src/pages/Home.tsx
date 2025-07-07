import { H1, Paragraph } from "../components/ui/typography";
import { Button } from "../components/ui/button";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SignUpModal } from "../components/SignUpModal";
import { useState } from "react";

export default function Home() {
  const [signUpOpen, setSignUpOpen] = useState(false);
  
  return (
    <div className="w-full min-h-screen bg-neutralWhite font-sans flex flex-col">
      
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-10 py-20 bg-color-deepTealBlue text-neutral-white">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <H1 className="text-4xl md:text-5xl font-bold leading-tight">
            Simplify your building's communication.
          </H1>

          <Paragraph className="text-lg md:text-xl text-color-concreteGray">
            CondoLink connects residents and building managers in a clear, modern, and organized way.
            Stay informed, submit requests, and build a stronger community.
          </Paragraph>

            <Button onClick={() => setSignUpOpen(true)} className="mt-4 px-6 py-3 text-lg shadow-md hover:shadow-lg transition">
              Get Started
            </Button>
        </div>
      </main>

      <Footer />

      <SignUpModal
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
      />
    </div>
  );
}
