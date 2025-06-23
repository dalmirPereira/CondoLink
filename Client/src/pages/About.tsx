import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { H1, Paragraph } from "../components/ui/typography";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-neutralWhite text-deepTealBlue font-sans flex flex-col">
      
      <Navbar />

      <main className="flex-grow px-4 sm:px-6 md:px-10 pt-25 pb-0">
        <div 
          className="max-w-5xl mx-auto space-y-12 animate-fade-in"
          style={{
              color: "var(--color-deepTealBlue)"
            }}
          >

          {/* Intro Section */}
          <div 
            className="bg-white rounded-2xl shadow-md sm:px-6 pt-8 pb-4 text-center space-y-6 border-2"
            style={{
              borderColor: "var(--color-softAqua)"
            }}
          >
            <H1>About CondoLink</H1>
            <Paragraph className="mx-auto">
              Designed for simplicity and built for modern living, CondoLink empowers residents,
              building managers, and service providers to connect, manage, and build stronger communities.
            </Paragraph>
          </div>

          {/* Why + What Section */}
          <div 
            className="bg-white rounded-2xl shadow-md p-6 sm:p-10 grid gap-10 md:grid-cols-2 border-2"
             style={{
              borderColor: "var(--color-softAqua)"
            }}
          >
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Why CondoLink?</h2>
              <p>
                Residential buildings often suffer from fragmented communication, manual processes,
                and low engagement. CondoLink brings all parties: residents, managers, and subcontractors; 
                onto a single, intuitive platform.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">What We Offer</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintenance request tracking with real-time updates</li>
                <li>Task scheduling and performance monitoring for managers</li>
                <li>Resident community tools: announcements, chats, and social feed</li>
                <li>Mobile-friendly and easy-to-use for all age groups</li>
              </ul>
            </div>
          </div>

          {/* Vision Section */}
          <div
            className="bg-white rounded-2xl shadow-md p-6 sm:p-10 text-center space-y-4 border-2"
            style={{
              borderColor: "var(--color-softAqua)"
            }}
          >
            <h2 className="text-xl font-semibold">Our Vision</h2>
            <p>
              We believe in efficient, transparent, and connected residential living.
              By simplifying building management and empowering users, CondoLink turns homes
              into communities.
            </p>

            <p className="italic mt-10 text-base" style={{ color: "var(--color-softAqua)" }}>
              <b>Thank you for being part of this journey.</b>
            </p>
          </div>

        </div>
      </main>

      <Footer />
      
    </div>
  );
}