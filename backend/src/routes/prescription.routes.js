const express = require("express");
const prescriptionController = require("../controllers/prescription.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Create prescription
router.post("/", prescriptionController.createPrescription);

// Search medicines
router.get("/search/medicines", prescriptionController.searchMedicines);

// Get all prescriptions (role-based)
router.get("/", prescriptionController.getPrescriptions);

// Get prescription by ID
router.get("/:prescriptionId", prescriptionController.getPrescriptionById);

// Generate prescription PDF
router.get(
  "/:prescriptionId/pdf",
  prescriptionController.generatePrescriptionPDF,
);

// Update prescription
router.patch("/:prescriptionId", prescriptionController.updatePrescription);

// Delete prescription
router.delete("/:prescriptionId", prescriptionController.deletePrescription);

module.exports = router;
