const express = require("express");
const appointmentController = require("../controllers/appointment.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Book appointment
router.post("/book", appointmentController.bookAppointment);

// Get available slots for a doctor
router.get("/available-slots", appointmentController.getAvailableSlots);

// Get all appointments (role-based)
router.get("/", appointmentController.getAppointments);

// Get appointment by ID
router.get("/:appointmentId", appointmentController.getAppointmentById);

// Update appointment status (doctor only)
router.patch(
  "/:appointmentId/status",
  appointmentController.updateAppointmentStatus,
);

// Cancel appointment
router.post("/:appointmentId/cancel", appointmentController.cancelAppointment);

module.exports = router;
