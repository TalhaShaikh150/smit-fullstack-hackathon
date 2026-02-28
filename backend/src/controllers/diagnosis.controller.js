const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const Diagnosis = require("../models/diagnosis.model");
const Appointment = require("../models/appointment.model");
const { HTTP_STATUS } = require("../constants");

// ────────────────────────────────────
// Create Diagnosis (Doctor)
// ────────────────────────────────────
const createDiagnosis = asyncHandler(async (req, res) => {
  const {
    appointmentId,
    symptoms,
    vitals,
    observations,
    diagnosis,
    icd10Code,
    treatmentPlan,
    followUpDate,
    urgency,
    referralNeeded,
    referralDetails,
  } = req.body;

  // Get appointment
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Appointment not found");
  }

  if (appointment.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "This appointment is not yours");
  }

  // Create diagnosis record
  const diagnosisRecord = await Diagnosis.create({
    appointment: appointmentId,
    patient: appointment.patient,
    doctor: req.user._id,
    symptoms: symptoms || appointment.symptoms,
    vitals,
    observations,
    diagnosis,
    icd10Code,
    treatmentPlan,
    followUpDate,
    urgency,
    referralNeeded,
    referralDetails,
    aiAnalysis: await getAIDiagnosisAnalysis(symptoms, vitals),
  }).populate(["patient", "doctor", "appointment"]);

  // Link diagnosis to appointment
  appointment.diagnosis = diagnosisRecord._id;
  await appointment.save();

  res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        diagnosisRecord,
        "Diagnosis created successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Patient's Diagnosis History
// ────────────────────────────────────
const getDiagnosisHistory = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === "patient") {
    query.patient = req.user._id;
  } else if (req.user.role === "doctor") {
    query.doctor = req.user._id;
  }

  const diagnoses = await Diagnosis.find(query)
    .populate(["patient", "doctor", "appointment"])
    .sort({ createdAt: -1 });

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        diagnoses,
        "Diagnosis history retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Get Diagnosis by ID
// ────────────────────────────────────
const getDiagnosisById = asyncHandler(async (req, res) => {
  const { diagnosisId } = req.params;

  const diagnosis = await Diagnosis.findById(diagnosisId).populate([
    "patient",
    "doctor",
    "appointment",
  ]);

  if (!diagnosis) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis not found");
  }

  // Verify access
  if (
    req.user.role === "patient" &&
    diagnosis.patient._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only view your own diagnosis",
    );
  }

  if (
    req.user.role === "doctor" &&
    diagnosis.doctor._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only view your own diagnosis",
    );
  }

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        diagnosis,
        "Diagnosis retrieved successfully",
      ),
    );
});

// ────────────────────────────────────
// Update Diagnosis (Doctor)
// ────────────────────────────────────
const updateDiagnosis = asyncHandler(async (req, res) => {
  const { diagnosisId } = req.params;
  const {
    symptoms,
    vitals,
    observations,
    diagnosis,
    icd10Code,
    treatmentPlan,
    followUpDate,
    urgency,
    referralNeeded,
    referralDetails,
  } = req.body;

  const diagnosisRecord = await Diagnosis.findById(diagnosisId);
  if (!diagnosisRecord) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Diagnosis not found");
  }

  if (diagnosisRecord.doctor.toString() !== req.user._id.toString()) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      "You can only update your own diagnosis",
    );
  }

  if (symptoms) diagnosisRecord.symptoms = symptoms;
  if (vitals) diagnosisRecord.vitals = vitals;
  if (observations) diagnosisRecord.observations = observations;
  if (diagnosis) diagnosisRecord.diagnosis = diagnosis;
  if (icd10Code) diagnosisRecord.icd10Code = icd10Code;
  if (treatmentPlan) diagnosisRecord.treatmentPlan = treatmentPlan;
  if (followUpDate) diagnosisRecord.followUpDate = followUpDate;
  if (urgency) diagnosisRecord.urgency = urgency;
  if (referralNeeded !== undefined)
    diagnosisRecord.referralNeeded = referralNeeded;
  if (referralDetails) diagnosisRecord.referralDetails = referralDetails;

  await diagnosisRecord.save();

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        diagnosisRecord,
        "Diagnosis updated successfully",
      ),
    );
});

// ────────────────────────────────────
// Get AI Diagnosis Assistance
// ────────────────────────────────────
const getAIDiagnosisAssistance = asyncHandler(async (req, res) => {
  const { symptoms, vitals } = req.body;

  // Mock AI analysis - In production, use actual AI service
  const aiAnalysis = await getAIDiagnosisAnalysis(symptoms, vitals);

  res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        { analysis: aiAnalysis },
        "AI analysis generated successfully",
      ),
    );
});

// ────────────────────────────────────
// Mock AI Analysis Function
// ────────────────────────────────────
async function getAIDiagnosisAnalysis(symptoms, vitals) {
  // In production, call OpenAI API, Claude API, or custom ML model
  // This is a mock implementation
  const mockAIAnalyses = {
    fever_cough:
      "Possible viral respiratory infection. Consider: COVID-19, Influenza, or common cold.",
    high_bp:
      "Patient shows elevated blood pressure. Monitor closely. Consider lifestyle changes and consultation with cardiologist.",
    fever_headache:
      "Symptoms suggest possible migraine or fever-related headache. Recommend hydration and pain management.",
  };

  let analysis =
    "Based on the symptoms and vitals provided, further investigation is recommended.";

  if (symptoms) {
    const symptomsLower = symptoms.toLowerCase();
    if (symptomsLower.includes("fever") && symptomsLower.includes("cough")) {
      analysis = mockAIAnalyses.fever_cough;
    } else if (vitals?.bloodPressure && vitals.bloodPressure.includes("160")) {
      analysis = mockAIAnalyses.high_bp;
    } else if (
      symptomsLower.includes("fever") &&
      symptomsLower.includes("headache")
    ) {
      analysis = mockAIAnalyses.fever_headache;
    }
  }

  return analysis;
}

// ────────────────────────────────────
// Get Analytics Dashboard (Doctor)
// ────────────────────────────────────
const getDoctorAnalytics = asyncHandler(async (req, res) => {
  const doctorId = req.user._id;

  const totalAppointments = await Appointment.countDocuments({
    doctor: doctorId,
  });

  const completedAppointments = await Appointment.countDocuments({
    doctor: doctorId,
    status: "completed",
  });

  const totalDiagnosis = await Diagnosis.countDocuments({
    doctor: doctorId,
  });

  const commonDiagnoses = await Diagnosis.aggregate([
    { $match: { doctor: doctorId } },
    { $group: { _id: "$diagnosis", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  res.status(HTTP_STATUS.OK).json(
    new ApiResponse(
      HTTP_STATUS.OK,
      {
        totalAppointments,
        completedAppointments,
        totalDiagnosis,
        commonDiagnoses,
      },
      "Analytics retrieved successfully",
    ),
  );
});

module.exports = {
  createDiagnosis,
  getDiagnosisHistory,
  getDiagnosisById,
  updateDiagnosis,
  getAIDiagnosisAssistance,
  getDoctorAnalytics,
};
