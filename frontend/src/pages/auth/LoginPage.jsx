import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  AlertCircle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const TEST_CREDENTIALS = {
  patient: {
    email: "patient@clinic.com",
    password: "Patient@123",
  },
  doctor: {
    email: "doctor@clinic.com",
    password: "Doctor@123",
  },
  receptionist: {
    email: "receptionist@clinic.com",
    password: "Receptionist@123",
  },
};

const LoginPage = () => {
  const [userType, setUserType] = useState("patient"); // patient | doctor | receptionist
  const [formData, setFormData] = useState(TEST_CREDENTIALS.patient);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn } = useAuth();
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserTypeChange = (newUserType) => {
    setUserType(newUserType);
    setFormData(TEST_CREDENTIALS[newUserType]);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login(formData).unwrap();
      toast.success("Logged in successfully!");

      const role = response.data?.user?.role || user?.role;
      const dashboard =
        {
          patient: "/patient/dashboard",
          doctor: "/doctor/dashboard",
          receptionist: "/receptionist/dashboard",
          admin: "/admin/dashboard",
        }[role] || "/";

      setTimeout(() => navigate(dashboard, { replace: true }), 300);
    } catch (err) {
      const message = err?.data?.message || "Login failed. Please try again.";
      toast.error(message);

      if (err?.data?.errors?.length) {
        const apiErrors = {};
        err.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        {/* Header */}
        <CardHeader className="space-y-2 text-center bg-gradient-to-b from-primary/5 to-transparent pb-6">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Sign in to access your account and continue where you left off
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            {/* User Type Toggle */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Login As:</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "patient", label: "Patient", icon: "👤" },
                  { value: "doctor", label: "Doctor", icon: "👨‍⚕️" },
                  {
                    value: "receptionist",
                    label: "Receptionist",
                    icon: "📋",
                  },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleUserTypeChange(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      userType === type.value
                        ? "border-primary bg-primary/10"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Demo Info */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-semibold text-amber-900 mb-1">
                💡 Demo Credentials (Auto-filled)
              </p>
              <p className="text-xs text-amber-800">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-xs text-amber-800">
                <strong>Password:</strong> {formData.password}
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={`transition-colors ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link to="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`pr-10 transition-colors ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              type="submit"
              className="w-full h-11 gap-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Admin Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-2 border-2 border-red-200 hover:bg-red-50"
              onClick={() => navigate("/admin/login")}
            >
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-red-600 font-semibold">Admin Login</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  New to MERN?
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Create one now
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
