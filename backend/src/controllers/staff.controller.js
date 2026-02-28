const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const StaffProfile = require("../models/staffProfile.model");
const User = require("../models/user.model");
const { HTTP_STATUS, ROLES } = require("../constants");

// ────────────────────────────────────
// Register Doctor/Receptionist (Admin)
// ────────────────────────────────────
const registerStaff = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    specialization,
    licenseNumber,
    qualifications,
    experience,
    consultationFee,
    department,
  } = req.body;

  if (!["doctor", "receptionist"].includes(role)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid staff role");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "User with this email already exists",
    );
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create staff profile
  const staffProfile = await StaffProfile.create({
    user: user._id,
    role,
    specialization: role === "doctor" ? specialization : undefined,
    licenseNumber: role === "doctor" ? licenseNumber : undefined,
    qualifications: role === "doctor" ? qualifications : undefined,
    experience: role === "doctor" ? experience : undefined,
    consultationFee: role === "doctor" ? consultationFee : undefined,
    department: role === "receptionist" ? department : undefined,
  });

  await staffProfile.populate("user");

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        { user, staffProfile },
        "Staff registered successfully",
      ),
    );
});

// ────────────────────────────────────
// Get All Doctors
// ────────────────────────────────────
const getDoctors = asyncHandler(async (req, res) => {
  const { specialization, status = "active" } = req.query;

  const query = { role: "doctor" };
  if (status) query.status = status;

  let staffProfiles = await StaffProfile.find(query).populate("user");

  if (specialization) {
    staffProfiles = staffProfiles.filter((s) =>
      s.specialization?.toLowerCase().includes(specialization.toLowerCase()),
    );
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfiles,
        "Doctors retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Get All Receptionists
// ────────────────────────────────────
const getReceptionists = asyncHandler(async (req, res) => {
  const { status = "active" } = req.query;

  const query = { role: "receptionist", status };

  const staffProfiles = await StaffProfile.find(query).populate("user");

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfiles,
        "Receptionists retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Staff Profile
// ────────────────────────────────────
const getStaffProfile = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staffProfile = await StaffProfile.findById(staffId).populate("user");

  if (!staffProfile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Staff not found");
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfile,
        "Staff profile retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Update Staff Profile
// ────────────────────────────────────
const updateStaffProfile = asyncHandler(async (req, res) => {
  const { staffId } = req.params;
  const {
    specialization,
    licenseNumber,
    qualifications,
    experience,
    consultationFee,
    department,
    status,
    availableSlots,
  } = req.body;

  const staffProfile = await StaffProfile.findById(staffId);
  if (!staffProfile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Staff not found");
  }

  if (staffProfile.role === "doctor") {
    if (specialization) staffProfile.specialization = specialization;
    if (licenseNumber) staffProfile.licenseNumber = licenseNumber;
    if (qualifications) staffProfile.qualifications = qualifications;
    if (experience) staffProfile.experience = experience;
    if (consultationFee) staffProfile.consultationFee = consultationFee;
    if (availableSlots) staffProfile.availableSlots = availableSlots;
  }

  if (staffProfile.role === "receptionist" && department) {
    staffProfile.department = department;
  }

  if (status) staffProfile.status = status;

  await staffProfile.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfile,
        "Staff profile updated successfully",
      ),
    );
});

// ────────────────────────────────────
// Verify Staff (Admin)
// ────────────────────────────────────
const verifyStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staffProfile = await StaffProfile.findById(staffId);
  if (!staffProfile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Staff not found");
  }

  staffProfile.isVerified = true;
  staffProfile.verifiedBy = req.user._id;
  await staffProfile.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfile,
        "Staff verified successfully",
      ),
    );
});

// ────────────────────────────────────
// Deactivate Staff (Admin)
// ────────────────────────────────────
const deactivateStaff = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staffProfile = await StaffProfile.findById(staffId);
  if (!staffProfile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Staff not found");
  }

  staffProfile.status = "inactive";
  await staffProfile.save();

  // Also deactivate the user account
  await User.findByIdAndUpdate(staffProfile.user, { isActive: false });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        staffProfile,
        "Staff deactivated successfully",
      ),
    );
});

// ────────────────────────────────────
// Delete Staff Account (Admin)
// ────────────────────────────────────
const deleteStaffAccount = asyncHandler(async (req, res) => {
  const { staffId } = req.params;

  const staffProfile = await StaffProfile.findById(staffId);
  if (!staffProfile) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Staff not found");
  }

  await User.findByIdAndDelete(staffProfile.user);
  await StaffProfile.findByIdAndDelete(staffId);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        "Staff account deleted successfully",
      ),
    );
});

// ────────────────────────────────────
// Get System Analytics (Admin)
// ────────────────────────────────────
const getSystemAnalytics = asyncHandler(async (req, res) => {
  const totalDoctors = await StaffProfile.countDocuments({ role: "doctor" });
  const totalReceptionists = await StaffProfile.countDocuments({
    role: "receptionist",
  });
  const totalPatients = await User.countDocuments({ role: ROLES.PATIENT });
  const totalUsers = await User.countDocuments();

  const appointmentStats = await Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        totalDoctors,
        totalReceptionists,
        totalPatients,
        totalUsers,
        appointmentStats,
      },
      "System analytics retrieved successfully",
    ),
  );
});

module.exports = {
  registerStaff,
  getDoctors,
  getReceptionists,
  getStaffProfile,
  updateStaffProfile,
  verifyStaff,
  deactivateStaff,
  deleteStaffAccount,
  getSystemAnalytics,
};
