const mongoose = require("mongoose");

const staffProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["doctor", "receptionist"],
      required: true,
    },
    // For Doctors
    specialization: {
      type: String,
      trim: true,
    },
    licenseNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    experience: {
      type: Number, // in years
    },
    consultationFee: {
      type: Number,
    },
    availableSlots: {
      monday: [String],
      tuesday: [String],
      wednesday: [String],
      thursday: [String],
      friday: [String],
      saturday: [String],
      sunday: [String],
    },
    // For Receptionists
    department: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on-leave"],
      default: "active",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("StaffProfile", staffProfileSchema);
