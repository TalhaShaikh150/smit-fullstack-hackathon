import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Menu, X, Plus, Calendar, Search, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
      {/* Top Utility Bar (Very 'Medical Software' look) */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs font-medium flex justify-between items-center">
        <div className="flex gap-4">
          <span>Emergency Support: +1 (800) 123-4567</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">AI System Online ●</span>
        </div>
        <div className="flex gap-4">
           <Link to="/help" className="hover:text-white">Help Center</Link>
           <Link to="/portal" className="hover:text-white">Patient Portal</Link>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              +
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Medi<span className="text-blue-600">Sync</span></span>
          </Link>

          {/* Search Bar (Fake) - Adds to the SaaS feel */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 w-64">
            <Search size={14} className="text-slate-400" />
            <span className="text-sm text-slate-400">Search patients, doctors...</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{user.role}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-semibold cursor-pointer" onClick={() => navigate(ROUTES.PROFILE)}>
                    {user.name.charAt(0)}
                </div>
              </div>
            </>
          ) : (
             <div className="flex gap-3">
                <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>Sign In</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(ROUTES.REGISTER)}>
                   Book Appointment
                </Button>
             </div>
          )}
           <button className="md:hidden ml-2" onClick={() => setMobileOpen(!mobileOpen)}><Menu /></button>
        </div>
      </div>
    </header>
  );
};
export default Header;