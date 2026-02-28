const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symptoms: {
      type: String,
      trim: true,
      required: true,
    },
    vitals: {
      temperature: Number,
      bloodPressure: String,
      heartRate: Number,
      respiratoryRate: Number,
      weight: Number,
      height: Number,
    },
    observations: {
      type: String,
      trim: true,
    },
    aiAnalysis: {
      type: String,
      trim: true,
      // Will contain AI-generated diagnosis suggestion
    },
    diagnosis: {
      type: String,
      trim: true,
      required: true,
    },
    icd10Code: {
      type: String,
      // ICD-10 medical classification code
    },
    treatmentPlan: {
      type: String,
      trim: true,
    },
    followUpDate: {
      type: Date,
    },
    urgency: {
      type: String,
      enum: ["routine", "urgent", "emergency"],
      default: "routine",
    },
    referralNeeded: {
      type: Boolean,
      default: false,
    },
    referralDetails: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Diagnosis", diagnosisSchema);
