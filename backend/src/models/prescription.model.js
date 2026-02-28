const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  dosage: {
    type: String,
    required: true, // e.g., "500mg"
  },
  frequency: {
    type: String,
    enum: [
      "Once daily",
      "Twice daily",
      "Thrice daily",
      "Every 4 hours",
      "Every 6 hours",
      "Every 8 hours",
    ],
    required: true,
  },
  duration: {
    type: String,
    required: true, // e.g., "7 days", "2 weeks"
  },
  instructions: {
    type: String,
    trim: true, // e.g., "After food"
  },
});

const prescriptionSchema = new mongoose.Schema(
  {
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    medicines: [medicineSchema],
    diagnosis: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "expired", "completed"],
      default: "active",
    },
    pdfUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
