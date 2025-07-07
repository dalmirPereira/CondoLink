import { NavLink } from "react-router-dom";
import { Home, Users, Wrench, UserCog  } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Sidebar() {
  const { auth } = useAuth();

  // Function to render sidebar items based on roleCode
  function renderSidebarItems(roleCode: number) {
    switch (roleCode) {
      case 3: //admin
        return (
          <>
            <SidebarItem to="/dashboard/admin" icon={<Home size={24} />} label="Dashboard" />
            <SidebarItem to="/dashboard/admin/residents" icon={<Users size={24} />} label="Residents" />
            <SidebarItem to="/dashboard/admin/subs" icon={<UserCog size={24} />} label="Subcontractors" />
            <SidebarItem to="/dashboard/admin/maintenance" icon={<Wrench size={24} />} label="Maintenance" />
          </>
        );
      case 2: //subcontractors
        return (
          <>
            <SidebarItem to="/dashboard/subs" icon={<Home size={24} />} label="Dashboard" />
          </>
        );
      default:
        return (
          <>
            <SidebarItem to="/dashboard/residents" icon={<Home size={24} />} label="Dashboard" />
          </>
        );
    }
  }

  return (
    <nav
      className="flex flex-col items-center gap-6 p-4 w-16 bg-white border h-full rounded-xl"
      style={{ borderColor: "var(--color-softAqua)", borderWidth: "3px" }}
    >
      {renderSidebarItems(auth.roleCode)}
    </nav>
  );
}

function SidebarItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <div className="relative group w-full flex justify-center">
      <NavLink
        to={to}
        end
        className="flex flex-col items-center"
        style={({ isActive }) => ({
          color: isActive ? "var(--color-softAqua)" : "var(--color-deepTealBlue)",
        })}
      >
        {icon}
      </NavLink>

      {/* Label shown on hover */}
      <span
        className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 bg-white"
        style={{
          color: "var(--color-deepTealBlue)",
          backgroundColor: "var(--color-white)",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
