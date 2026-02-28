const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
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
    receptionist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
      ],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    symptoms: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    diagnosis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Diagnosis",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
