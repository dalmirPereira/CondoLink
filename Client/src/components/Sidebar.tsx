import { Link } from "react-router-dom";
import { Home, Users, Settings, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Sidebar() {

  const { auth } = useAuth();

  const fullName = auth?.safeUser?.fullName || "";
  const firstName = fullName.split(" ")[0] || "User";

  return (
    <nav
      className="flex flex-col gap-6 text-base p-6 h-full bg-white border rounded-xl"
      style={{ borderColor: "var(--color-softAqua)", borderWidth: "3px" }}
    >

      <div className="mb-4">
        <p className="font-bold text-2xl"
          style={{color: "var(--color-deepTealBlue)"}}>
          Hi, {firstName} 👋
        </p>
      </div>

      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-deepTealBlue hover:text-softAqua transition"
      >
        <Home size={18} />
        Dashboard
      </Link>

      <Link
        to="/dashboard/users"
        className="flex items-center gap-2 text-deepTealBlue hover:text-softAqua transition"
      >
        <Users size={18} />
        Users
      </Link>

      <Link
        to="/dashboard/notifications"
        className="flex items-center gap-2 text-deepTealBlue hover:text-softAqua transition"
      >
        <Bell size={18} />
        Notifications
      </Link>

      <Link
        to="/dashboard/settings"
        className="flex items-center gap-2 text-deepTealBlue hover:text-softAqua transition"
      >
        <Settings size={18} />
        Settings
      </Link>
    </nav>
  );
}
