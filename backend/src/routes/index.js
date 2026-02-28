const { Router } = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const appointmentRoutes = require("./appointment.routes");
const prescriptionRoutes = require("./prescription.routes");
const diagnosisRoutes = require("./diagnosis.routes");
const staffRoutes = require("./staff.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/prescriptions", prescriptionRoutes);
router.use("/diagnosis", diagnosisRoutes);
router.use("/staff", staffRoutes);

module.exports = router;
