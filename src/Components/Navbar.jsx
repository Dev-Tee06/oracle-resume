import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.jpg";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative text-sm font-semibold transition-colors duration-300
     ${isActive ? "text-[#05d1ed]" : "text-white hover:text-[#05d1ed]"}`;

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-33">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="
                h-26  w-26 rounded-full object-contain
                scale-110
                contrast-125
                brightness-110
                drop-shadow-[0_2px_8px_rgba(5,209,237,0.35)]
              "
            />
          </NavLink>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/services" className={linkClass}>
              Services
            </NavLink>
            <NavLink to="/portfolio" className={linkClass}>
              Portfolio
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white focus:outline-none"
          >
            {open ? <HiX size={30} /> : <HiMenuAlt3 size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="flex flex-col px-4 py-6 space-y-6">
            <NavLink
              onClick={() => setOpen(false)}
              to="/"
              className={linkClass}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/about"
              className={linkClass}
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/services"
              className={linkClass}
            >
              Services
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/portfolio"
              className={linkClass}
            >
              Portfolio
            </NavLink>
            <NavLink
              onClick={() => setOpen(false)}
              to="/contact"
              className={linkClass}
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
