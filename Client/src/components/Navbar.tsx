import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Logo from "../assets/CondoLink.png"

export function Navbar() {

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b border-concreteGray shadow-sm">
      
      {/* Logo and Title */}
      <Link to="/" className="flex items-center justify-center gap-3">
        <img src={Logo} alt="CondoLink Logo" className="h-12 w-auto" />
      </Link>

      {/* Desktop Nav Links */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">
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
        <Link to="/signup" className="inline-block hover:none">
          <Button>Sign Up</Button>
        </Link>
      </nav>

      {/* Mobile Menu */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="md:hidden">
            Menu
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <nav className="flex flex-col gap-3">
            <Link to="/about" className="hover:text-condoBlue transition-colors">
              About
            </Link>
            <Link to="/login" className="hover:text-condoBlue transition-colors">
              Login
            </Link>
            <Link to="/signup">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </nav>
        </PopoverContent>
      </Popover>
      
    </header>
  );
}
