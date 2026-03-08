import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Loader2, Menu, Truck, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const navLinks = [
  { to: "/", label: "Home", ocid: "nav.home_link" },
  { to: "/book", label: "Book a Ride", ocid: "nav.book_link" },
  { to: "/track", label: "Track", ocid: "nav.track_link" },
  { to: "/my-bookings", label: "My Bookings", ocid: "nav.mybookings_link" },
];

export function Navbar() {
  const { login, clear, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Main navbar */}
      <div className="brand-gradient border-b border-white/10 noise-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.home_link"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center shadow-orange">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-white text-lg tracking-tight leading-none">
                  AK
                </span>
                <span className="font-display font-bold text-accent text-[10px] tracking-[0.15em] uppercase leading-none">
                  TRANSPORT
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                data-ocid="nav.admin_link"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive("/admin")
                    ? "bg-accent/20 text-accent"
                    : "text-accent/80 hover:text-accent hover:bg-accent/10"
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth + mobile toggle */}
          <div className="flex items-center gap-3">
            {!identity ? (
              <Button
                onClick={login}
                disabled={isLoggingIn || isInitializing}
                data-ocid="nav.login_button"
                size="sm"
                className="bg-accent hover:bg-accent/90 text-white font-semibold shadow-orange border-0 transition-all"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : null}
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-xs text-white/60 font-mono">
                  {identity.getPrincipal().toString().slice(0, 8)}...
                </span>
                <Button
                  onClick={clear}
                  data-ocid="nav.login_button"
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white bg-transparent"
                >
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden text-white/80 hover:text-white p-1"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden brand-gradient border-b border-white/10 overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid={link.ocid}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  data-ocid="nav.admin_link"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-md text-sm font-medium text-accent/80 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
