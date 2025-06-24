import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex flex-grow p-5">
        {/* flex row container full height */}
        <aside className="min-w-50">
          <Sidebar />
        </aside>

        <section className="flex-grow ml-8 p-6 rounded-r-xl shadow-inner overflow-auto">
          
        </section>
      </main>

      <Footer />
    </div>
  );
}