const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
  editPost,
  deletePost,
  getPostById,
} = require("../controllers/postController");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.put("/:id", protect, editPost);
router.delete("/:id", protect, deletePost);

module.exports = router;
