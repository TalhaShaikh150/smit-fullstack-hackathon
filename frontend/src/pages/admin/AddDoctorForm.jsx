import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
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
  useRegisterDoctorMutation,
  useUpdateDoctorMutation,
  useUpdateAvatarMutation,
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

const AddDoctorForm = ({
  onSuccess,
  onCancel,
  mode = "create",
  doctor = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    qualifications: "",
    experience: "",
    consultationFee: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const [registerDoctor, { isLoading: isRegistering }] =
    useRegisterDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();

  const isLoading =
    isRegistering || isUpdating || uploadingImage || isUploadingAvatar;
  const isEditMode = mode === "edit" && doctor;

  // Pre-fill form for edit mode
  useEffect(() => {
    if (isEditMode && doctor) {
      setFormData({
        name: doctor.user?.name || "",
        email: doctor.user?.email || "",
        password: "",
        confirmPassword: "",
        specialization: doctor.specialization || "",
        licenseNumber: doctor.licenseNumber || "",
        qualifications: doctor.qualifications || "",
        experience: doctor.experience || "",
        consultationFee: doctor.consultationFee || "",
      });
      // Set image preview from doctor's avatar if exists
      if (doctor.user?.avatar?.url) {
        setImagePreview(doctor.user.avatar.url);
      }
    }
  }, [isEditMode, doctor]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size must be less than 5MB");
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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

    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!formData.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required";
    }

    if (!formData.experience) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.consultationFee) {
      newErrors.consultationFee = "Consultation fee is required";
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

      // Convert data types
      submitData.experience = parseInt(submitData.experience, 10);
      submitData.consultationFee = parseFloat(submitData.consultationFee);
      // qualifications as string - backend will handle parsing if needed
      if (!submitData.qualifications.trim()) {
        submitData.qualifications = "";
      }

      let createdOrUpdatedDoctor;

      if (isEditMode) {
        // Only send password if it was changed
        if (!submitData.password) {
          delete submitData.password;
        }
        const response = await updateDoctor({
          id: doctor._id,
          body: submitData,
        }).unwrap();
        createdOrUpdatedDoctor = response.data;
        toast.success("Doctor updated successfully!");
      } else {
        const response = await registerDoctor(submitData).unwrap();
        createdOrUpdatedDoctor = response.data.user;
        toast.success("Doctor registered successfully!");
      }

      // Upload image if provided
      if (imageFile && createdOrUpdatedDoctor._id) {
        setUploadingImage(true);
        try {
          const formDataImage = new FormData();
          formDataImage.append("avatar", imageFile);

          await updateAvatar({
            id: createdOrUpdatedDoctor._id,
            formData: formDataImage,
          }).unwrap();

          toast.success("Profile image uploaded successfully!");
        } catch (err) {
          console.error("Image upload failed:", err);
          toast.error("Profile image upload failed, but doctor was saved");
        } finally {
          setUploadingImage(false);
        }
      }

      onSuccess?.();
    } catch (err) {
      const message = err?.data?.message || "Failed to save doctor";
      toast.error(message);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Doctor" : "Register New Doctor"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Update doctor information"
            : "Add a doctor to the system"}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Profile Image Upload */}
          <div className="space-y-3 pb-4 border-b">
            <Label className="text-sm font-medium">Profile Image</Label>
            <div className="flex gap-4">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Doctor preview"
                    className="h-24 w-24 rounded-lg object-cover border border-border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              {/* Upload Input */}
              <div className="flex-1 flex flex-col justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                  className="hidden"
                  id="imageInput"
                />
                <label htmlFor="imageInput">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                    disabled={isLoading}
                    className="w-full cursor-pointer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imageFile ? "Change Image" : "Upload Image"}
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF (Max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Dr. John Doe"
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
              placeholder="doctor@clinic.com"
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
              Password{" "}
              {mode === "create" ? "*" : "(leave empty to keep current)"}
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

          {/* Specialization */}
          <div className="space-y-2">
            <Label htmlFor="specialization" className="text-sm font-medium">
              Specialization *
            </Label>
            <Input
              id="specialization"
              name="specialization"
              placeholder="e.g., Cardiology, Pediatrics"
              value={formData.specialization}
              onChange={handleChange}
              className={errors.specialization ? "border-destructive" : ""}
            />
            {errors.specialization && (
              <p className="text-sm text-destructive">
                {errors.specialization}
              </p>
            )}
          </div>

          {/* License Number */}
          <div className="space-y-2">
            <Label htmlFor="licenseNumber" className="text-sm font-medium">
              License Number *
            </Label>
            <Input
              id="licenseNumber"
              name="licenseNumber"
              placeholder="e.g., LIC123456"
              value={formData.licenseNumber}
              onChange={handleChange}
              className={errors.licenseNumber ? "border-destructive" : ""}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-destructive">{errors.licenseNumber}</p>
            )}
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <Label htmlFor="qualifications" className="text-sm font-medium">
              Qualifications *
            </Label>
            <Input
              id="qualifications"
              name="qualifications"
              placeholder="e.g., MD, MBBS"
              value={formData.qualifications}
              onChange={handleChange}
              className={errors.qualifications ? "border-destructive" : ""}
            />
            {errors.qualifications && (
              <p className="text-sm text-destructive">
                {errors.qualifications}
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm font-medium">
              Years of Experience *
            </Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              min="0"
              placeholder="e.g., 5"
              value={formData.experience}
              onChange={handleChange}
              className={errors.experience ? "border-destructive" : ""}
            />
            {errors.experience && (
              <p className="text-sm text-destructive">{errors.experience}</p>
            )}
          </div>

          {/* Consultation Fee */}
          <div className="space-y-2">
            <Label htmlFor="consultationFee" className="text-sm font-medium">
              Consultation Fee *
            </Label>
            <Input
              id="consultationFee"
              name="consultationFee"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 500"
              value={formData.consultationFee}
              onChange={handleChange}
              className={errors.consultationFee ? "border-destructive" : ""}
            />
            {errors.consultationFee && (
              <p className="text-sm text-destructive">
                {errors.consultationFee}
              </p>
            )}
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
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Doctor"
                : "Register Doctor"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddDoctorForm;
