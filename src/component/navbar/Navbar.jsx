import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Import menu and close icons
import logo from "../../assets/logo.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-customBlue text-white flex justify-between items-center p-4 shadow-md z-50">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="w-14 h-10" />
      </Link>

      {/* Menu Button for small screens */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Navigation Links - Hidden on small screens, visible on md+ */}
      <span className="hidden md:flex">
        <Link
          to="/"
          className="px-4 text-lg p-1 hover:bg-[#0f2e64] transition-colors duration-300 before:bg-[#0f2e64] rounded"
        >
          Home
        </Link>
        <Link
          to="/calculateForm"
          className="px-4 text-lg p-1 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
        >
          Calculate Price
        </Link> 
        <Link
          to="/estimates"
          className="px-4 text-lg p-1 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
        >
          Estimated Price
        </Link>
      </span>

      {/* Login Button */}
      <Link
        to="/signIn"
        className="px-4 text-lg p-1 bg-[#4d5ab1] hover:bg-[#0f2e64] transition-colors duration-300 rounded"
      >
        Login
      </Link>

      {/* Mobile Menu - Shown when isOpen is true */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-customBlue p-4 flex flex-col items-center md:hidden">
          <Link
            to="/"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/calculateForm"
            className="w-full text-center py-2 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
            onClick={() => setIsOpen(false)}
          >
            Calculate Price
          </Link>
          <Link
          to="/estimates"
          className="px-4 text-lg p-1 hover:bg-[#0f2e64] transition-colors duration-300 rounded"
          onClick={() => setIsOpen(false)}
        >
          Estimated Price
        </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;