const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
  const post = await Post.create({
    user: req.user._id,
    content: req.body.content,
  });

  await post.populate('user', 'name profilePic');
  res.status(201).json(post);
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("user", "name profilePic")
    .populate('likes', 'name profilePic')
    .populate('comments.user', 'name profilePic')
    .sort({ createdAt: -1 });

  res.json(posts);
};

// GET posts by specific user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name profilePic')
      .populate('likes', 'name profilePic')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET current user's posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id })
      .populate('user', 'name profilePic')
      .populate('likes', 'name profilePic')
      .populate('comments.user', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

  await post.populate('user', 'name profilePic');
  await post.populate('likes', 'name profilePic');
  await post.populate('comments.user', 'name profilePic');

  res.json(post);
};

// UPDATE post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    post.content = req.body.content || post.content;
    await post.save();

    await post.populate('user', 'name profilePic');
    await post.populate('likes', 'name profilePic');
    await post.populate('comments.user', 'name profilePic');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

  await post.populate('user', 'name profilePic');
  await post.populate('likes', 'name profilePic');
  await post.populate('comments.user', 'name profilePic');

  res.json(post);
};
