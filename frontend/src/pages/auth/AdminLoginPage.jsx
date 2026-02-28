import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("admin@clinic.com");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await login({ email, password }).unwrap();

      // Check if user is admin
      if (response.data?.user?.role !== "admin") {
        toast.error("This account does not have admin privileges");
        setErrors({ submit: "Admin access denied" });
        return;
      }

      toast.success("Admin logged in successfully!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const message = err?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      setErrors({ submit: message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-red-50 via-background to-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-md shadow-lg border-2 border-red-100">
        {/* Header with Admin Badge */}
        <CardHeader className="space-y-2 text-center bg-gradient-to-b from-red-500/10 to-transparent pb-6">
          <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
            <Shield className="h-7 w-7 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <span>Admin Portal</span>
            <span className="inline-block px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full">
              ADMIN
            </span>
          </CardTitle>
          <CardDescription className="text-base">
            Restricted Access - Administrators Only
          </CardDescription>
        </CardHeader>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            {/* Admin Warning */}
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-red-900">
                  Authorized Access Only
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Unauthorized access attempts are logged and monitored
                </p>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@clinic.com"
                value={email}
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
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

            {/* Submit Error */}
            {errors.submit && (
              <p className="text-sm text-destructive bg-red-50 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errors.submit}
              </p>
            )}

            {/* Demo Credentials Info */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-2">
                Demo Credentials (Testing)
              </p>
              <p className="text-xs text-blue-700">
                <strong>Email:</strong> admin@clinic.com
              </p>
              <p className="text-xs text-blue-700">
                <strong>Password:</strong> Admin@123
              </p>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="px-6 py-6 border-t space-y-4">
            <Button
              type="submit"
              className="w-full h-11 gap-2 bg-red-600 hover:bg-red-700"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Authenticating...
                </>
              ) : (
                <>
                  Admin Login
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Not an admin?</span>
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Regular Login
              </Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
