const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  getUserPosts,
  getMyPosts,
  toggleLike,
  addComment,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.get("/my-posts", protect, getMyPosts);
router.get("/user/:userId", protect, getUserPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;
