const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  getMyProfile,
  updateProfile,
  toggleFollow,
  getPublicProfile,
  uploadProfilePic,
  searchUsers,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.get("/search", protect, searchUsers);

// ✅ PROFILE PHOTO UPLOAD ROUTE
router.put(
  "/profile-pic",
  protect,
  upload.single("image"),
  uploadProfilePic
);


router.put("/:id/follow", protect, toggleFollow);
router.get("/:id", protect, getPublicProfile);

module.exports = router;
