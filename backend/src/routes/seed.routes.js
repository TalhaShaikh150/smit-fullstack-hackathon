const express = require("express");
const seedDatabase = require("../utils/seed");
const env = require("../config/env.config");

const router = express.Router();

/**
 * Seed Database Endpoint (Development Only)
 * POST /api/v1/seed
 *
 * This endpoint is ONLY available in development mode
 * It creates test users for testing purposes
 */
router.post("/", async (req, res) => {
  // Only allow in development
  if (env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Seeding is only available in development mode",
    });
  }

  try {
    console.log("Starting database seed from API endpoint...");

    // Import models
    const User = require("../models/user.model");
    const StaffProfile = require("../models/staffProfile.model");
    const bcrypt = require("bcryptjs");

    // Clear existing test users
    await User.deleteMany({
      email: {
        $in: [
          "admin@clinic.com",
          "patient@clinic.com",
          "patient2@clinic.com",
          "doctor@clinic.com",
          "doctor2@clinic.com",
          "receptionist@clinic.com",
        ],
      },
    });
    await StaffProfile.deleteMany({});

    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
    const hashedPatientPassword = await bcrypt.hash("Patient@123", 10);
    const hashedDoctorPassword = await bcrypt.hash("Doctor@123", 10);
    const hashedReceptionistPassword = await bcrypt.hash(
      "Receptionist@123",
      10,
    );

    // 1. Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@clinic.com",
      password: hashedAdminPassword,
      role: "admin",
    });

    // 2. Create Patients
    await User.create({
      name: "John Doe",
      email: "patient@clinic.com",
      password: hashedPatientPassword,
      role: "patient",
    });

    await User.create({
      name: "Jane Smith",
      email: "patient2@clinic.com",
      password: hashedPatientPassword,
      role: "patient",
    });

    // 3. Create Doctors
    const doctor1 = await User.create({
      name: "Dr. Sarah Smith",
      email: "doctor@clinic.com",
      password: hashedDoctorPassword,
      role: "doctor",
    });

    await StaffProfile.create({
      user: doctor1._id,
      role: "doctor",
      specialization: "Cardiology",
      licenseNumber: "LIC-CARD-001",
      qualifications: "MD, MBBS, DM Cardiology",
      experience: 8,
      consultationFee: 500,
      status: "active",
    });

    const doctor2 = await User.create({
      name: "Dr. John Wilson",
      email: "doctor2@clinic.com",
      password: hashedDoctorPassword,
      role: "doctor",
    });

    await StaffProfile.create({
      user: doctor2._id,
      role: "doctor",
      specialization: "Pediatrics",
      licenseNumber: "LIC-PED-002",
      qualifications: "MD, MBBS, DCH",
      experience: 5,
      consultationFee: 400,
      status: "active",
    });

    // 4. Create Receptionist
    const receptionist = await User.create({
      name: "Sarah Johnson",
      email: "receptionist@clinic.com",
      password: hashedReceptionistPassword,
      role: "receptionist",
    });

    await StaffProfile.create({
      user: receptionist._id,
      role: "receptionist",
      department: "General",
      phone: "+1-555-123-4567",
      status: "active",
    });

    res.status(200).json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        admin: admin.email,
        credentials: {
          admin: {
            email: "admin@clinic.com",
            password: "Admin@123",
          },
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
        },
      },
    });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to seed database",
      error: error.message,
    });
  }
});

module.exports = router;
