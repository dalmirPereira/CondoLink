import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Logo from "../assets/CondoLink.png"
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith("/dashboard");

  const handleLogout = () => {
    logout();
    toast("Logged out", { description: "You have successfully logged out." });
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-concreteGray shadow-sm">

      {/* Logo and Title */}
      <Link to="/" className="flex items-center justify-center gap-3">
        <img src={Logo} alt="CondoLink Logo" className="h-12 w-auto" />
      </Link>

      {!isDashboard ? (
        <>
          < nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link
              to="/about"
              className="px-4 py-2 rounded-md text-base font-medium text-deepTealBlue hover:bg-deepTealBlue hover:text-neutralWhite transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded-md text-base font-big text-deepTealBlue hover:bg-deepTealBlue hover:text-neutralWhite transition-colors duration-200"
            >
              Login
            </Link>
            <Button onClick={() => navigate("/signup")}>Sign Up</Button>
          </nav>


          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="md:hidden">
                Menu
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-40 border-2"
              style={{
                backgroundColor: "var(--color-neutralWhite)",
                borderColor: "var(--color-softAqua)"
              }}>
              <nav className="flex flex-col gap-3 items-center">
                <Link to="/about" className="hover:text-condoBlue transition-colors">
                  About
                </Link>
                <Link to="/login" className="hover:text-condoBlue transition-colors">
                  Login
                </Link>
                <Button onClick={() => navigate("/signup")}>Sign Up</Button>
              </nav>
            </PopoverContent>
          </Popover>
        </>
      ) : (
        <div className="flex items-center gap-6">
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}




    </header >
  );
}
