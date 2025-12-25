const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
    getMyProfile,
    toggleFollow,
    getFollowers,
    getFollowing,
    searchUsers,
    getNotifications,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/:id/follow", protect, toggleFollow);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.get("/search", protect, searchUsers);
router.get("/notifications", protect, getNotifications);



module.exports = router;
