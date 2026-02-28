const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bloodType: {
      type: String,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    allergies: [
      {
        name: String,
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
      },
    ],
    chronicDiseases: [String], // e.g., ["Diabetes", "Hypertension"]
    familyHistory: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    insuranceDetails: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
    },
    medicalHistory: [
      {
        condition: String,
        treatedBy: String,
        diagnosisDate: Date,
        status: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("PatientProfile", patientProfileSchema);
