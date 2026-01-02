const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadProfilePic } = require("../controllers/userController");

const {
    getMyProfile,
    updateProfile,
    toggleFollow,
    getFollowers,
    getFollowing,
    searchUsers,
    getNotifications,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/update", protect, updateProfile);
router.put("/:id/follow", protect, toggleFollow);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.get("/search", protect, searchUsers);
router.get("/notifications", protect, getNotifications);

router.put(
  "/profile-pic",
  protect,
  upload.single("image"),
  uploadProfilePic
);

const { getPublicProfile } = require("../controllers/userController");

router.get("/:id", protect, getPublicProfile);

const { updateUsername } = require("../controllers/userController");
router.put("/username", protect, updateUsername);


module.exports = router;
