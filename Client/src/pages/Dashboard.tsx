import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { Outlet } from "react-router-dom"; //nested routes

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <main className="flex flex-grow p-5 ">
        {/* flex row container full height */}
        <aside className="min-w-16">
          <Sidebar />
        </aside>

        <section className="flex-grow pl-4 ">
           <Outlet />
        </section>
      </main>

      <Footer />
    </div>
  );
}