const Post = require("../models/Post");
const Notification = require("../models/Notification");

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like or Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);

      // 🔔 LIKE NOTIFICATION (no self-like)
      if (post.user.toString() !== userId) {
        await Notification.create({
          user: post.user,
          fromUser: req.user._id,
          type: "like",
          post: post._id,
        });
      }
    }

    await post.save();

    res.json({
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user._id,
      text,
    };

    post.comments.push(comment);

    // 🔔 COMMENT NOTIFICATION (no self-comment)
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.user,
        fromUser: req.user._id,
        type: "comment",
        post: post._id,
      });
    }

    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

if (post.user.toString() !== req.user.id) {
  const notification = await Notification.create({
    user: post.user,
    fromUser: req.user.id,
    type: "comment",
    post: post._id,
  });

  const receiverSocket = onlineUsers.get(post.user.toString());

  if (receiverSocket) {
    io.to(receiverSocket).emit("newNotification", notification);
  }
}


// @desc    Edit a post
// @route   PUT /api/posts/:id
// @access  Private
exports.editPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.content = content.trim();
    await post.save();

    res.json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const io = req.app.get("io");
const onlineUsers = req.app.get("onlineUsers");
if (!isLiked && post.user.toString() !== userId) {
  const notification = await Notification.create({
    user: post.user,
    fromUser: userId,
    type: "like",
    post: post._id,
  });

  const receiverSocket = onlineUsers.get(post.user.toString());

  if (receiverSocket) {
    io.to(receiverSocket).emit("newNotification", notification);
  }
}
