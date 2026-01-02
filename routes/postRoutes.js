const express = require("express");
const protect = require("../middleware/authMiddleware");
const { editPost } = require("../controllers/postController");

const {
    createPost,
    getPosts,
    toggleLike,
    deletePost,
    addComment,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", protect, createPost); // 👈 THIS LINE for Creating the posts
router.get("/", protect, getPosts);  // 👈 THIS LINE for Getting the posts
router.put("/:id/like", protect, toggleLike); // 👈 THIS LINE for Liking the posts
router.delete("/:id", protect, deletePost); // 👈 For deleting Lines
router.post("/:id/comment", protect, addComment);  // 👈 For adding comments to the posts
router.put("/:id", protect, editPost); // 👈 For editing the posts


module.exports = router;
