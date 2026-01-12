const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
  const post = await Post.create({
    user: req.user._id,
    content: req.body.content,
  });
  res.status(201).json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("user", "name profilePic")
    .sort({ createdAt: -1 });

  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const userId = req.user._id.toString();

  if (!post) return res.status(404).json({ message: "Post not found" });

  const liked = post.likes.includes(userId);

  if (liked) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);

    if (post.user.toString() !== userId) {
      const notification = await Notification.create({
        user: post.user,
        fromUser: userId,
        type: "like",
        post: post._id,
      });

      const io = req.app.get("io");
      const onlineUsers = req.app.get("onlineUsers");
      const socketId = onlineUsers.get(post.user.toString());

      if (socketId) io.to(socketId).emit("newNotification", notification);
    }
  }

  await post.save();
  res.json(post);
};

exports.addComment = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();

  if (post.user.toString() !== req.user._id.toString()) {
    const notification = await Notification.create({
      user: post.user,
      fromUser: req.user._id,
      type: "comment",
      post: post._id,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    const socketId = onlineUsers.get(post.user.toString());

    if (socketId) io.to(socketId).emit("newNotification", notification);
  }

  res.json(post.comments);
};
