import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Upload, Lock, LogOut, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
  useChangePasswordMutation,
  useDeactivateAccountMutation,
} from "@/features/auth/authApi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Mutations
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();
  const [removeAvatar, { isLoading: isRemovingAvatar }] =
    useRemoveAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [deactivateAccount, { isLoading: isDeactivating }] =
    useDeactivateAccountMutation();

  // Form States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ── Handle Profile Update ──
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        id: user._id,
        body: profileForm,
      }).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  // ── Handle Avatar Upload ──
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, JPG, PNG, and WEBP files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await updateAvatar({
        id: user._id,
        formData,
      }).unwrap();
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload avatar");
    }
  };

  // ── Handle Remove Avatar ──
  const handleRemoveAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your avatar?")) return;

    try {
      await removeAvatar(user._id).unwrap();
      toast.success("Avatar removed successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to remove avatar");
    }
  };

  // ── Handle Change Password ──
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      await changePassword({
        id: user._id,
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        },
      }).unwrap();
      toast.success("Password changed successfully. Please login again.");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password");
    }
  };

  // ── Handle Deactivate Account ──
  const handleDeactivateAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate your account? This action cannot be undone from here.",
      )
    )
      return;

    try {
      await deactivateAccount(user._id).unwrap();
      toast.success("Account deactivated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to deactivate account");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and account preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="inline mr-2 h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              activeTab === "password"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="inline mr-2 h-4 w-4" />
            Password
          </button>
          <button
            onClick={() => setActiveTab("danger")}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              activeTab === "danger"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertCircle className="inline mr-2 h-4 w-4" />
            Danger Zone
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Avatar Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isUploadingAvatar}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                    {user?.avatar?.url && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        disabled={isRemovingAvatar}
                      >
                        {isRemovingAvatar ? "Removing..." : "Remove"}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG, WEBP • Max 5MB
                  </p>
                </div>
              </div>
            </Card>

            {/* Profile Information Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Profile Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    type="text"
                    value={
                      user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)
                    }
                    disabled
                  />
                </div>
                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Card>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  Password must contain uppercase, lowercase, number, and
                  special character
                </p>
              </div>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </Card>
        )}

        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <Card className="p-6 border-destructive">
            <h2 className="text-xl font-semibold mb-4 text-destructive">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <h3 className="font-medium mb-2">Deactivate Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your account will be deactivated and you will be logged out.
                  You won&apos;t be able to login with this account until it is
                  reactivated.
                </p>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleDeactivateAccount}
                  disabled={isDeactivating}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isDeactivating ? "Deactivating..." : "Deactivate Account"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
