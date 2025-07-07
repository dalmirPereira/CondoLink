import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import Logo from "../assets/CondoLink.png";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { LoginModal } from "./LoginModal";
import { SignUpModal } from "./SignUpModal";

export function Navbar() {
  const { logout, auth } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false); // LoginModal state
  const [signUpOpen, setSignUpOpen] = useState(false); // SignUpModal state
 

  const fullName = auth?.fullName || "";
  const firstName = fullName.split(" ")[0] || "User";

  const handleLogout = () => {
    logout();
    toast("Logged out", { description: "You have successfully logged out." });
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white border-b border-concreteGray shadow-sm">
      {/* Logo como link dinâmico */}
      <Link to={auth?.id ? (auth.roleCode === 3 ? "/dashboard/admin" : auth.roleCode === 2 ? "/dashboard/subs" : "/dashboard/resident") : "/"}>
        <img
          src={Logo}
          alt="CondoLink Logo"
          className="flex items-center justify-center gap-3 h-12 w-auto"
        />
      </Link>

      {!auth?.id ? (
        <>
          {/* Desktop nav */}
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Button onClick={() => setLoginOpen(true)}>Login</Button>
            <Button onClick={() => setSignUpOpen(true)}>Sign Up</Button>
          </nav>

          {/* Mobile nav */}
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
              }}
            >
              <nav className="flex flex-col gap-3 items-center">
                <Button onClick={() => setLoginOpen(true)}>Login</Button>
                <Button onClick={() => setSignUpOpen(true)}>Sign Up</Button>
              </nav>
            </PopoverContent>
          </Popover>
        </>
      ) : (
        <div className="flex items-center gap-6">
          <p
            className="font-bold text-base"
            style={{ color: "var(--color-deepTealBlue)" }}
          >
            Hi, {firstName} 👋
          </p>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      {/* Modals */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <SignUpModal open={signUpOpen} onOpenChange={setSignUpOpen} />
    </header>
  );
}
