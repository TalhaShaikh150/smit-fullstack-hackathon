const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
  updateUserRole,
  deactivateUser,
  deleteUser,
} = require("../controllers/user.controller");
const {
  authenticate,
  authorize,
  authorizeOwner,
} = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  updateProfileSchema,
  changePasswordSchema,
  updateRoleSchema,
} = require("../validators/user.validator");
const upload = require("../config/multer.config");
const { ROLES } = require("../constants");

const router = Router();

// ── All routes below require authentication ──
router.use(authenticate);

// Custom upload helper: try 'avatar' field first, fall back to 'file' if client used generic name
// this prevents multer "Unexpected field" errors when callers forget the exact field name.
const avatarUpload = (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      // second attempt with a common alternative key
      upload.single("file")(req, res, next);
    } else {
      next(err);
    }
  });
};

// ── Admin Only Routes ──
router.get("/", authorize(ROLES.ADMIN), getAllUsers);
router.patch(
  "/:id/role",
  authorize(ROLES.ADMIN),
  validate(updateRoleSchema),
  updateUserRole
);
router.delete("/:id", authorize(ROLES.ADMIN), deleteUser);

// ── Owner + Admin Routes ──
router.get("/:id", authorizeOwner, getUserById);
router.patch(
  "/:id/profile",
  authorizeOwner,
  validate(updateProfileSchema),
  updateProfile
);
router.patch(
  "/:id/avatar",
  authorizeOwner,
  avatarUpload,
  updateAvatar
);
router.delete("/:id/avatar", authorizeOwner, removeAvatar);
router.patch(
  "/:id/change-password",
  authorizeOwner,
  validate(changePasswordSchema),
  changePassword
);
router.patch("/:id/deactivate", authorizeOwner, deactivateUser);

module.exports = router;