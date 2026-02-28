const express = require("express");
const diagnosisController = require("../controllers/diagnosis.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Create diagnosis
router.post("/", diagnosisController.createDiagnosis);

// Get AI diagnosis assistance
router.post("/ai/analysis", diagnosisController.getAIDiagnosisAssistance);

// Get diagnosis history
router.get("/", diagnosisController.getDiagnosisHistory);

// Get doctor analytics
router.get("/analytics/doctor", diagnosisController.getDoctorAnalytics);

// Get diagnosis by ID
router.get("/:diagnosisId", diagnosisController.getDiagnosisById);

// Update diagnosis
router.patch("/:diagnosisId", diagnosisController.updateDiagnosis);

module.exports = router;
