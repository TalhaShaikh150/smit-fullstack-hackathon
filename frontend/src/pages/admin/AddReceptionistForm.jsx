import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, Check, X } from "lucide-react";
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
import {
  useRegisterReceptionistMutation,
  useUpdateReceptionistMutation,
} from "@/features/auth/authApi";
import { toast } from "sonner";

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-destructive flex-shrink-0" />
    )}
    <span className="text-muted-foreground">{text}</span>
  </div>
);

const AddReceptionistForm = ({
  onSuccess,
  onCancel,
  mode = "create",
  receptionist = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [registerReceptionist, { isLoading: isRegistering }] =
    useRegisterReceptionistMutation();
  const [updateReceptionist, { isLoading: isUpdating }] =
    useUpdateReceptionistMutation();

  const isLoading = isRegistering || isUpdating;
  const isEditMode = mode === "edit" && receptionist;

  // Pre-fill form for edit mode
  useEffect(() => {
    if (isEditMode && receptionist) {
      setFormData({
        name: receptionist.user?.name || "",
        email: receptionist.user?.email || "",
        password: "",
        confirmPassword: "",
        department: receptionist.department || "",
        phone: receptionist.phone || "",
        address: receptionist.address || "",
      });
    }
  }, [isEditMode, receptionist]);

  // Password validation checks
  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasNumber: /\d/.test(formData.password),
  };

  const isPasswordValid = formData.password
    ? Object.values(passwordChecks).every((check) => check)
    : true;

  const passwordsMatch =
    !formData.password ||
    (formData.password && formData.password === formData.confirmPassword);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password only required in create mode
    if (mode === "create") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!isPasswordValid) {
        newErrors.password = "Password must be 6+ chars with number";
      }

      if (!passwordsMatch) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (mode === "edit") {
      // In edit mode, password is optional but must be valid if provided
      if (formData.password && !isPasswordValid) {
        newErrors.password = "Password must be 6+ chars with number";
      }
      if (formData.password && !passwordsMatch) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const { confirmPassword, ...submitData } = formData;

      if (isEditMode) {
        // Only send password if it was changed
        if (!submitData.password) {
          delete submitData.password;
        }
        await updateReceptionist({
          id: receptionist._id,
          body: submitData,
        }).unwrap();
        toast.success("Receptionist updated successfully!");
      } else {
        await registerReceptionist(submitData).unwrap();
        toast.success("Receptionist registered successfully!");
      }
      onSuccess?.();
    } catch (err) {
      const message = err?.data?.message || "Failed to save receptionist";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Receptionist" : "Register New Receptionist"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update receptionist information"
            : "Add a receptionist to the system"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Sarah Johnson"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="receptionist@clinic.com"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password {mode === "create" ? "*" : "(leave empty to keep current)"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.password && (
              <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                <p className="text-xs font-medium">Requirements:</p>
                <PasswordRequirement
                  met={passwordChecks.minLength}
                  text="6+ characters"
                />
                <PasswordRequirement
                  met={passwordChecks.hasNumber}
                  text="Contains number"
                />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          {formData.password && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pr-10 ${
                    errors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department" className="text-sm font-medium">
              Department *
            </Label>
            <Input
              id="department"
              name="department"
              placeholder="e.g., General, Emergency"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? "border-destructive" : ""}
            />
            {errors.department && (
              <p className="text-sm text-destructive">{errors.department}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number *
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="Street address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditMode ? "Update Receptionist" : "Register Receptionist"}
          </Button>
        </div>
      </form>
    </Card>
  );
};
export default AddReceptionistForm;
