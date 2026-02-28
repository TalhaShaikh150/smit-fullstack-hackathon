const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const { HTTP_STATUS } = require("../constants");

// ────────────────────────────────────
// Book Appointment (Patient/Receptionist)
// ────────────────────────────────────
const bookAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, appointmentDate, timeSlot, reason, symptoms } =
    req.body;

  // Validate appointment date is in future
  if (new Date(appointmentDate) < new Date()) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Appointment date must be in the future",
    );
  }

  // Check if slot is already booked
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: {
      $gte: new Date(appointmentDate).setHours(0, 0, 0, 0),
      $lt: new Date(appointmentDate).setHours(23, 59, 59, 999),
    },
    timeSlot,
    status: { $in: ["scheduled", "completed"] },
  });

  if (existingAppointment) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "This time slot is already booked",
    );
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    receptionist: req.user._id,
    appointmentDate,
    timeSlot,
    reason,
    symptoms,
  }).populate(["patient", "doctor"]);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        appointment,
        "Appointment booked successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Appointments (Doctor/Patient)
// ────────────────────────────────────
const getAppointments = asyncHandler(async (req, res) => {
  const { status = "scheduled", date } = req.query;
  const query = {};

  if (req.user.role === "doctor") {
    query.doctor = req.user._id;
  } else if (req.user.role === "patient") {
    query.patient = req.user._id;
  } else if (req.user.role === "receptionist") {
    // Receptionist sees all appointments
  }

  if (status) query.status = status;
  if (date) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    query.appointmentDate = { $gte: startDate, $lte: endDate };
  }

  const appointments = await Appointment.find(query)
    .populate(["patient", "doctor"])
    .sort({ appointmentDate: 1 });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        appointments,
        "Appointments retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Update Appointment Status (Doctor)
// ────────────────────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  if (appointment.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only update your own appointments",
    );
  }

  appointment.status = status;
  await appointment.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        appointment,
        "Appointment status updated successfully",
      ),
    );
});

// ────────────────────────────────────
// Cancel Appointment
// ────────────────────────────────────
const cancelAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  // Only patient, doctor, or receptionist can cancel
  if (
    !(
      appointment.patient.toString() === req.user._id.toString() ||
      appointment.doctor.toString() === req.user._id.toString() ||
      appointment.receptionist?.toString() === req.user._id.toString()
    )
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You cannot cancel this appointment",
    );
  }

  appointment.status = "cancelled";
  await appointment.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        appointment,
        "Appointment cancelled successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Appointment by ID
// ────────────────────────────────────
const getAppointmentById = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findById(appointmentId).populate([
    "patient",
    "doctor",
    "diagnosis",
  ]);

  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        appointment,
        "Appointment retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Doctor's Available Slots
// ────────────────────────────────────
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.query;

  const appointmentDate = new Date(date);
  const startDate = new Date(appointmentDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(appointmentDate);
  endDate.setHours(23, 59, 59, 999);

  const bookedSlots = await Appointment.find({
    doctor: doctorId,
    appointmentDate: { $gte: startDate, $lte: endDate },
    status: { $in: ["scheduled", "completed"] },
  }).select("timeSlot");

  const allSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  const bookedSlotTimes = bookedSlots.map((a) => a.timeSlot);
  const availableSlots = allSlots.filter(
    (slot) => !bookedSlotTimes.includes(slot),
  );

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        { availableSlots },
        "Available slots retrieved successfully",
      ),
    );
});

module.exports = {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentById,
  getAvailableSlots,
};
