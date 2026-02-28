import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, Menu, X, Home, Code2, Settings, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const Header = () => {
  const { isAuthenticated, user, logout, isLoggingOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      setMobileOpen(false);
      navigate(ROUTES.LOGIN);
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = [
    { label: "Home", path: ROUTES.HOME, icon: Home },
    { label: "About", path: ROUTES.ABOUT, icon: Code2 },
    { label: "Contact", path: ROUTES.CONTACT, icon: Settings },
  ];

  // Helper to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- Logo Section --- */}
        <Link
          to={ROUTES.HOME}
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground leading-none">
              HackBoiler
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">
              MERN Stack
            </span>
          </div>
        </Link>

        {/* --- Desktop Nav --- */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/50 bg-secondary/20 p-1 px-4 backdrop-blur-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full hover:text-primary ${
                  active
                    ? "text-primary bg-background shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "fill-current" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* --- Auth Buttons --- */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Profile Chip */}
              <Link
                to={ROUTES.PROFILE}
                className="group flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-border/40 bg-background hover:bg-muted/40 transition-all hover:border-primary/30"
              >
                <div className="h-8 w-8 rounded-full bg-secondary ring-2 ring-background overflow-hidden group-hover:ring-primary/20 transition-all">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold leading-none">{user?.name}</span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-1">View Profile</span>
                </div>
              </Link>

              {/* Logout Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                <Link to={ROUTES.LOGIN}>Sign In</Link>
              </Button>
              <Button size="sm" asChild className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                <Link to={ROUTES.REGISTER}>Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* --- Mobile Toggle --- */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* --- Mobile Menu --- */}
      {mobileOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200 shadow-2xl">
          <div className="container px-4 py-6 space-y-6">
            
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                      active 
                      ? "bg-primary/10 text-primary font-semibold" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </div>
                    {active && <ChevronRight className="h-4 w-4" />}
                  </Link>
                );
              })}
            </div>

            <div className="h-px bg-border/50" />

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {user?.avatar?.url ? (
                        <img src={user.avatar.url} alt={user?.name} className="h-full w-full object-cover"/>
                    ) : (
                        <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>
                
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={ROUTES.LOGIN}>Sign In</Link>
                </Button>
                <Button className="w-full shadow-md shadow-primary/20" asChild>
                  <Link to={ROUTES.REGISTER}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;