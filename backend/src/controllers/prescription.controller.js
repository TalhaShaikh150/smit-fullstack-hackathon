const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Prescription = require("../models/prescription.model");
const Appointment = require("../models/appointment.model");
const { HTTP_STATUS } = require("../constants");

// ────────────────────────────────────
// Create Prescription (Doctor)
// ────────────────────────────────────
const createPrescription = asyncHandler(async (req, res) => {
  const { patientId, appointmentId, medicines, diagnosis, notes } = req.body;

  // Validate appointment exists and belongs to this doctor
  if (appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
    }
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "This appointment is not yours",
      );
    }
  }

  const prescription = await Prescription.create({
    patient: patientId,
    doctor: req.user._id,
    appointment: appointmentId,
    medicines,
    diagnosis,
    notes,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  }).populate(["patient", "doctor"]);

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        prescription,
        "Prescription created successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Patient's Prescriptions
// ────────────────────────────────────
const getPrescriptions = asyncHandler(async (req, res) => {
  const { status = "active" } = req.query;
  const query = {};

  if (req.user.role === "patient") {
    query.patient = req.user._id;
  } else if (req.user.role === "doctor") {
    query.doctor = req.user._id;
  }

  if (status) query.status = status;

  const prescriptions = await Prescription.find(query)
    .populate(["patient", "doctor"])
    .sort({ issuedDate: -1 });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        prescriptions,
        "Prescriptions retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Prescription by ID
// ────────────────────────────────────
const getPrescriptionById = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId).populate([
    "patient",
    "doctor",
  ]);

  if (!prescription) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
  }

  // Verify access
  if (
    req.user.role === "patient" &&
    prescription.patient._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only view your own prescriptions",
    );
  }

  if (
    req.user.role === "doctor" &&
    prescription.doctor._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only view prescriptions you created",
    );
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        prescription,
        "Prescription retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Update Prescription (Doctor)
// ────────────────────────────────────
const updatePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;
  const { medicines, diagnosis, notes } = req.body;

  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
  }

  if (prescription.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only update your own prescriptions",
    );
  }

  if (medicines) prescription.medicines = medicines;
  if (diagnosis) prescription.diagnosis = diagnosis;
  if (notes) prescription.notes = notes;

  await prescription.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        prescription,
        "Prescription updated successfully",
      ),
    );
});

// ────────────────────────────────────
// Delete Prescription (Doctor)
// ────────────────────────────────────
const deletePrescription = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId);
  if (!prescription) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
  }

  if (prescription.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only delete your own prescriptions",
    );
  }

  await Prescription.findByIdAndDelete(prescriptionId);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        null,
        "Prescription deleted successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Medicine Details (Search)
// ────────────────────────────────────
const searchMedicines = asyncHandler(async (req, res) => {
  const { query } = req.query;

  // In real app, this would query a medicines database
  // For now, return mock data
  const mockMedicines = [
    {
      id: 1,
      name: "Amoxicillin",
      dosages: ["250mg", "500mg", "1000mg"],
      commonFrequencies: ["Twice daily", "Thrice daily"],
    },
    {
      id: 2,
      name: "Ibuprofen",
      dosages: ["200mg", "400mg", "600mg"],
      commonFrequencies: ["Every 4 hours", "Every 6 hours"],
    },
    {
      id: 3,
      name: "Paracetamol",
      dosages: ["250mg", "500mg", "1000mg"],
      commonFrequencies: ["Every 4 hours", "Every 6 hours"],
    },
  ];

  const medicines = mockMedicines.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        medicines,
        "Medicines retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Generate Prescription PDF URL mock
// ────────────────────────────────────
const generatePrescriptionPDF = asyncHandler(async (req, res) => {
  const { prescriptionId } = req.params;

  const prescription = await Prescription.findById(prescriptionId).populate([
    "patient",
    "doctor",
  ]);

  if (!prescription) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Prescription not found");
  }

  // Verify access
  if (prescription.patient._id.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only download your own prescriptions",
    );
  }

  // In a real app, generate PDF using pdfkit or html2pdf
  // For now, return mock PDF URL
  const pdfUrl = `${process.env.API_URL}/prescriptions/${prescriptionId}.pdf`;

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        { pdfUrl },
        "PDF URL generated successfully",
      ),
    );
});

module.exports = {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  searchMedicines,
  generatePrescriptionPDF,
};
