import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  User,
  Stethoscope,
  ClipboardList,
  ShieldCheck,
  ChevronLeft,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const LoginPage = () => {
  const [userType, setUserType] = useState("patient"); // patient | doctor | receptionist | admin
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  // Helper to get Role Specific Content
  const getRoleContent = () => {
    switch (userType) {
      case "patient":
        return { label: "Patient", desc: "Book appointments & view history", color: "text-indigo-600", bg: "bg-indigo-50" };
      case "doctor":
        return { label: "Doctor", desc: "Manage patients & appointments", color: "text-teal-600", bg: "bg-teal-50" };
      case "receptionist":
        return { label: "Staff", desc: "Front desk & scheduling operations", color: "text-blue-600", bg: "bg-blue-50" };
      case "admin":
        return { label: "Administrator", desc: "System-wide settings & control", color: "text-rose-600", bg: "bg-rose-50" };
      default:
        return { label: "User", desc: "Login to continue" };
    }
  };

  const roleData = getRoleContent();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const loginPayload = { ...formData, role: userType };
      const response = await login(loginPayload).unwrap();
      
      toast.success(`Welcome back, ${response.data?.user?.name || 'User'}!`);
      
      const role = response.data?.user?.role || userType;
      const dashboardPath = {
        patient: "/patient/dashboard",
        doctor: "/doctor/dashboard",
        receptionist: "/receptionist/dashboard",
        admin: "/admin/dashboard",
      }[role] || ROUTES.HOME;

      navigate(dashboardPath, { replace: true });

    } catch (err) {
      toast.error(err?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-[Plus_Jakarta_Sans]">
      
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* --- Header & Logo --- */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
               <Sparkles size={20} fill="currentColor" className="text-white/90" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight font-[Outfit]">
              Prescripto
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 font-[Outfit]">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-500">
            Secure access to your healthcare portal.
          </p>
        </div>

        {/* --- Main Card --- */}
        <div className="bg-white px-8 py-10 shadow-xl shadow-slate-200/60 rounded-[2rem] border border-slate-100 relative overflow-hidden">
          
          {/* Top Decorative Line */}
          <div className={`absolute top-0 left-0 w-full h-1.5 ${userType === 'admin' ? 'bg-rose-500' : 'bg-indigo-500'}`} />

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* --- ROLE SELECTOR LOGIC --- */}
            {userType === 'admin' ? (
              // ADMIN MODE UI
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center justify-between mb-6 animate-in slide-in-from-right-4">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                       <ShieldCheck size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-rose-900">Administrator Portal</p>
                       <p className="text-xs text-rose-600">Restricted Access</p>
                    </div>
                 </div>
                 <button 
                   type="button" 
                   onClick={() => setUserType('patient')}
                   className="text-xs font-semibold text-rose-500 hover:text-rose-700 underline"
                 >
                    Exit
                 </button>
              </div>
            ) : (
              // STANDARD USER MODE UI
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Select Role</Label>
                  <button 
                      type="button"
                      onClick={() => setUserType('admin')}
                      className="text-[10px] font-medium text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                      <Lock size={10} /> Admin Access
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/80 rounded-xl">
                  {[
                    { id: "patient", label: "Patient", icon: User },
                    { id: "doctor", label: "Doctor", icon: Stethoscope },
                    { id: "receptionist", label: "Staff", icon: ClipboardList },
                  ].map((role) => {
                    const Icon = role.icon;
                    const active = userType === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setUserType(role.id)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-lg text-xs font-bold transition-all duration-200 ${
                          active
                            ? "bg-white text-indigo-600 shadow-sm ring-1 ring-black/5"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        }`}
                      >
                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* --- DYNAMIC HEADER --- */}
            <div className={`text-center py-2 px-4 rounded-lg border border-dashed border-slate-200 ${roleData.bg}`}>
                <p className={`text-xs font-semibold ${roleData.color}`}>
                   Logging in as <span className="uppercase">{roleData.label}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{roleData.desc}</p>
            </div>


            {/* --- FORM FIELDS --- */}
            <div className="space-y-5">
              
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium ml-1">Email Address</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.email ? "border-red-500 bg-red-50/50" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label className="text-slate-700 font-medium">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`h-12 pr-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.password ? "border-red-500 bg-red-50/50" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isLoggingIn}
                className={`w-full h-12 text-base font-bold text-white rounded-full shadow-lg transition-all hover:scale-[1.02] mt-2 ${
                    userType === 'admin' 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {isLoggingIn ? (
                   <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                   </div>
                ) : (
                   <div className="flex items-center justify-center gap-2">
                      Sign In <ArrowRight size={18} />
                   </div>
                )}
              </Button>
            </div>
          </form>

          {/* --- Footer --- */}
          {userType !== 'admin' && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-500 text-sm">
                Don't have an account?{" "}
                <Link 
                    to={ROUTES.REGISTER} 
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                    Create account
                </Link>
                </p>
            </div>
          )}
          
          {userType === 'admin' && (
             <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <button onClick={() => setUserType('patient')} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 mx-auto">
                    <ChevronLeft size={16} /> Back to User Login
                </button>
             </div>
          )}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-8">
           &copy; {new Date().getFullYear()} Prescripto Clinic. Secure Login.
        </p>

      </div>
    </div>
  );
};

export default LoginPage;