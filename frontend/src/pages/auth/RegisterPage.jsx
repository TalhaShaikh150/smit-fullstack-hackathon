import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X,
  Stethoscope,
  User,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const PasswordRequirement = ({ met, text }) => (
  <div
    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? "text-emerald-600" : "text-slate-400"}`}
  >
    {met ? (
      <Check className="h-3.5 w-3.5 flex-shrink-0" />
    ) : (
      <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />
    )}
    <span>{text}</span>
  </div>
);

const RegisterPage = () => {
  const [userType, setUserType] = useState("patient");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  // Validation Logic
  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*?&#]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every((check) => check);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!isPasswordValid) newErrors.password = "Password is too weak";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
      const { confirmPassword, ...registerData } = formData;
      await register(registerData).unwrap();
      toast.success("Account created successfully!");
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-[Plus_Jakarta_Sans]">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* --- Header & Logo --- */}
        <div className="text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2.5 mb-6 group"
          >
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Sparkles
                size={20}
                fill="currentColor"
                className="text-white/90"
              />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight font-[Outfit]">
              HealthStack
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-slate-900 font-[Outfit]">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please fill in the details to get started.
          </p>
        </div>

        <div className="bg-white px-8 py-8 shadow-xl shadow-slate-200/60 rounded-[2rem] border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* --- Role Selection --- */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                I am a
              </Label>
              <div className="grid grid-cols-3 gap-3 p-1 bg-slate-50 rounded-xl border border-slate-200">
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
                      className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          active ? "text-indigo-600" : "text-slate-400"
                        }
                      />
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* --- Form Fields --- */}
            {userType === "patient" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Full Name
                  </Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.name ? "border-red-500 bg-red-50/50" : ""}`}
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`h-12 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.email ? "border-red-500 bg-red-50/50" : ""}`}
                    placeholder="name@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={`h-12 pr-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.password ? "border-red-500 bg-red-50/50" : ""}`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="grid grid-cols-2 gap-2 pt-1 pl-1">
                      <PasswordRequirement
                        met={passwordChecks.minLength}
                        text="8+ characters"
                      />
                      <PasswordRequirement
                        met={passwordChecks.hasUpper}
                        text="Uppercase letter"
                      />
                      <PasswordRequirement
                        met={passwordChecks.hasNumber}
                        text="Number"
                      />
                      <PasswordRequirement
                        met={passwordChecks.hasSpecial}
                        text="Symbol"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`h-12 pr-10 rounded-xl border-slate-200 focus-visible:ring-indigo-600 bg-slate-50/50 ${errors.confirmPassword ? "border-red-500 bg-red-50/50" : ""}`}
                      placeholder="Repeat password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-600/20 mt-4 transition-all hover:scale-[1.02]"
                >
                  {isRegistering ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            ) : (
              // --- Staff/Doctor Restriction Message ---
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                  <div className="font-bold text-xl">i</div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 font-[Outfit]">
                    Restricted Access
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    To ensure security,{" "}
                    <b>{userType === "doctor" ? "Doctors" : "Staff"}</b> must be
                    registered by the Clinic Administrator.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-full border-slate-300"
                  asChild
                >
                  <Link to={ROUTES.CONTACT}>Contact Admin</Link>
                </Button>
              </div>
            )}
          </form>

          {/* --- Footer Links --- */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} HealthStack Clinic. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
