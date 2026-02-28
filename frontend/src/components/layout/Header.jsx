import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Calendar,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate(ROUTES.LOGIN);
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { label: "HOME", path: ROUTES.HOME },
    { label: "ALL DOCTORS", path: "/doctors" }, // Adjust route as needed
    { label: "ABOUT", path: ROUTES.ABOUT },
    { label: "CONTACT", path: ROUTES.CONTACT },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-indigo-100 transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between font-[Outfit]">
        {/* --- BRANDING --- */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
          {/* Matching the Footer Sparkle Icon */}
          <div className="h-9 w-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles size={18} fill="currentColor" className="text-white/90" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
            HealthStack
          </span>
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-semibold tracking-wide transition-colors relative py-1 group ${
                isActive(link.path)
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {link.label}
              {/* Animated Underline */}
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform origin-left transition-transform duration-300 ${isActive(link.path) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
              />
            </Link>
          ))}
        </nav>

        {/* --- AUTH / ACTIONS --- */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              {/* Profile Trigger */}
              <div
                className="flex items-center gap-2.5 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-indigo-500" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-700">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-20 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/appointments"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <Calendar size={16} /> My Appointments
                    </Link>

                    {/* Role-based Navigation */}
                    {user?.role === "admin" && (
                      <>
                        <div className="h-px bg-slate-100 my-1" />
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          📊 Admin Dashboard
                        </Link>
                        <Link
                          to="/admin/manage-staff"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          👥 Manage Staff
                        </Link>
                      </>
                    )}

                    {user?.role === "doctor" && (
                      <>
                        <div className="h-px bg-slate-100 my-1" />
                        <Link
                          to="/doctor/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          👨‍⚕️ Doctor Dashboard
                        </Link>
                      </>
                    )}

                    {user?.role === "receptionist" && (
                      <>
                        <div className="h-px bg-slate-100 my-1" />
                        <Link
                          to="/receptionist/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          📋 Receptionist Dashboard
                        </Link>
                        <Link
                          to="/receptionist/check-in"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          ✓ Check-In
                        </Link>
                      </>
                    )}

                    {user?.role === "patient" && (
                      <>
                        <div className="h-px bg-slate-100 my-1" />
                        <Link
                          to="/patient/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          📋 Patient Dashboard
                        </Link>
                      </>
                    )}

                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.LOGIN}
                className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Sign in
              </Link>
              <Button
                asChild
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-600/20"
              >
                <Link to={ROUTES.REGISTER}>Create account</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* --- MOBILE SIDEBAR --- */}
      <div
        className={`fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm transition-opacity ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={16} fill="currentColor" />
              </div>
              <span className="font-bold text-lg text-slate-800">
                HealthStack
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-6 py-4 text-sm font-medium border-l-4 transition-colors ${
                    isActive(link.path)
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-transparent text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {!isAuthenticated && (
            <div className="p-6 border-t border-slate-100 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-full border-slate-200"
                asChild
              >
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-full"
                asChild
              >
                <Link to={ROUTES.REGISTER}>Create account</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
