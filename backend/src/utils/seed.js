/**
 * Database Seeding Utility
 * Use this to populate the database with test data
 *
 * Can be used as:
 * 1. Node script: node seed.js
 * 2. API endpoint: GET /api/v1/seed (development only)
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Import models
const User = require("./models/user.model");
const StaffProfile = require("./models/staffProfile.model");

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/clinic_ai";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

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
    console.log("🧹 Cleared old test data");

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
    console.log("✅ Admin created:", admin.email);

    // 2. Create Patients
    const patient1 = await User.create({
      name: "John Doe",
      email: "patient@clinic.com",
      password: hashedPatientPassword,
      role: "patient",
    });
    console.log("✅ Patient 1 created:", patient1.email);

    const patient2 = await User.create({
      name: "Jane Smith",
      email: "patient2@clinic.com",
      password: hashedPatientPassword,
      role: "patient",
    });
    console.log("✅ Patient 2 created:", patient2.email);

    // 3. Create Doctors with StaffProfile
    const doctor1 = await User.create({
      name: "Dr. Sarah Smith",
      email: "doctor@clinic.com",
      password: hashedDoctorPassword,
      role: "doctor",
    });
    console.log("✅ Doctor 1 created:", doctor1.email);

    const doctorProfile1 = await StaffProfile.create({
      user: doctor1._id,
      role: "doctor",
      specialization: "Cardiology",
      licenseNumber: "LIC-CARD-001",
      qualifications: "MD, MBBS, DM Cardiology",
      experience: 8,
      consultationFee: 500,
      status: "active",
      department: "Cardiology",
    });
    console.log("✅ Doctor 1 profile created");

    const doctor2 = await User.create({
      name: "Dr. John Wilson",
      email: "doctor2@clinic.com",
      password: hashedDoctorPassword,
      role: "doctor",
    });
    console.log("✅ Doctor 2 created:", doctor2.email);

    const doctorProfile2 = await StaffProfile.create({
      user: doctor2._id,
      role: "doctor",
      specialization: "Pediatrics",
      licenseNumber: "LIC-PED-002",
      qualifications: "MD, MBBS, DCH",
      experience: 5,
      consultationFee: 400,
      status: "active",
      department: "Pediatrics",
    });
    console.log("✅ Doctor 2 profile created");

    // 4. Create Receptionist with StaffProfile
    const receptionist = await User.create({
      name: "Sarah Johnson",
      email: "receptionist@clinic.com",
      password: hashedReceptionistPassword,
      role: "receptionist",
    });
    console.log("✅ Receptionist created:", receptionist.email);

    const receptionistProfile = await StaffProfile.create({
      user: receptionist._id,
      role: "receptionist",
      department: "General",
      phone: "+1-555-123-4567",
      address: "123 Main Street, City",
      status: "active",
    });
    console.log("✅ Receptionist profile created");

    console.log("\n");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("\n📝 Test Credentials:\n");
    console.log("ADMIN LOGIN:");
    console.log("  Email:    admin@clinic.com");
    console.log("  Password: Admin@123");
    console.log("  URL:      http://localhost:5174/admin/login\n");
    console.log("PATIENT LOGIN:");
    console.log("  Email:    patient@clinic.com");
    console.log("  Password: Patient@123");
    console.log("  URL:      http://localhost:5174/login (select Patient)\n");
    console.log("DOCTOR LOGIN:");
    console.log("  Email:    doctor@clinic.com");
    console.log("  Password: Doctor@123");
    console.log("  URL:      http://localhost:5174/login (select Doctor)\n");
    console.log("RECEPTIONIST LOGIN:");
    console.log("  Email:    receptionist@clinic.com");
    console.log("  Password: Receptionist@123");
    console.log(
      "  URL:      http://localhost:5174/login (select Receptionist)\n",
    );
    console.log(
      "═══════════════════════════════════════════════════════════\n",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

// Run if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
