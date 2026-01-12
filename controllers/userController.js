const User = require("../models/User");
const Notification = require("../models/Notification");
const cloudinary = require("cloudinary").v2;


exports.getMyProfile = async (req, res) => {
  res.json(req.user);
};



exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  Object.assign(user, req.body);
  await user.save();

  res.json(user);
};

exports.toggleFollow = async (req, res) => {
  const target = await User.findById(req.params.id);
  const current = await User.findById(req.user._id);

  if (!target) return res.status(404).json({ message: "User not found" });

  const isFollowing = current.following.includes(target._id);

  if (isFollowing) {
    current.following.pull(target._id);
    target.followers.pull(current._id);
  } else {
    current.following.push(target._id);
    target.followers.push(current._id);

    await Notification.create({
      user: target._id,
      fromUser: current._id,
      type: "follow",
    });
  }

  await current.save();
  await target.save();

  res.json({ following: current.following });
};

// GET PUBLIC PROFILE
// GET /api/users/:id
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("followers", "name profilePic")
      .populate("following", "name profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.uploadProfilePic = async (req, res) => {
  try {


    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "devconnect/profile_pics",
    });

    const user = await User.findById(req.user.id);
    user.profilePic = result.secure_url;
    await user.save();

    res.json({ profilePic: user.profilePic });

    const fs = require("fs");

    fs.unlink(req.file.path, (err) => {
      if (err) console.log("File cleanup error:", err);
    });

  } catch (error) {

    res.status(500).json({ message: error.message });
  }
};
