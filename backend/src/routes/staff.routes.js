const express = require("express");
const staffController = require("../controllers/staff.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// public endpoints
// Get all doctors (no authentication) - shown to patients/guests
router.get("/doctors", staffController.getDoctors);

// Apply auth middleware to remaining routes
router.use(authenticate);

// Register staff (admin only)
router.post("/register", authorize("admin"), staffController.registerStaff);

// Get all receptionists
router.get(
  "/receptionists",
  authorize("admin"),
  staffController.getReceptionists,
);

// Get system analytics (admin only)
router.get(
  "/analytics/system",
  authorize("admin"),
  staffController.getSystemAnalytics,
);

// Get staff profile
router.get("/:staffId", staffController.getStaffProfile);

// Update staff profile
router.patch("/:staffId", staffController.updateStaffProfile);

// Verify staff (admin only)
router.post(
  "/:staffId/verify",
  authorize("admin"),
  staffController.verifyStaff,
);

// Deactivate staff
router.post(
  "/:staffId/deactivate",
  authorize("admin"),
  staffController.deactivateStaff,
);

// Delete staff account
router.delete(
  "/:staffId",
  authorize("admin"),
  staffController.deleteStaffAccount,
);

module.exports = router;
