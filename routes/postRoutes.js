const router = require("express").Router();
const protect = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} = require("../controllers/postController");

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);

module.exports = router;
