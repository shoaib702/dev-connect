const Notification = require("../models/Notification");

const User = require("../models/User");

exports.getMyProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow or Unfollow a user
// @route   PUT /api/users/:id/follow
// @access  Private
exports.toggleFollow = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const isFollowing = currentUser.following.includes(userToFollow._id);

        if (isFollowing) {
            // UNFOLLOW
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== userToFollow._id.toString()
            );
            userToFollow.followers = userToFollow.followers.filter(
                (id) => id.toString() !== currentUser._id.toString()
            );
        } else {
            // FOLLOW
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            const Notification = require("../models/Notification");

            await Notification.create({
                user: userToFollow._id,
                fromUser: currentUser._id,
                type: "follow",
            });
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({
            followingCount: currentUser.following.length,
            followersCount: userToFollow.followers.length,
            isFollowing: !isFollowing,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get followers of a user
// @route   GET /api/users/:id/followers
// @access  Private
exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("followers", "name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            count: user.followers.length,
            followers: user.followers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get following list of a user
// @route   GET /api/users/:id/following
// @access  Private
exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate("following", "name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            count: user.following.length,
            following: user.following,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search users by name
// @route   GET /api/users/search?query=shoaib
// @access  Private
exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const users = await User.find({
            name: { $regex: query, $options: "i" }, // case-insensitive
        })
            .select("name email skills github linkedin")
            .limit(10);

        res.json({
            count: users.length,
            users,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user's notifications
// @route   GET /api/users/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.user._id,
        })
            .populate("fromUser", "name email")
            .sort({ createdAt: -1 });

        res.json({
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update logged-in user profile
// @route   PUT /api/users/update
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { bio, skills, github, linkedin } = req.body;

        if (bio !== undefined) user.bio = bio;
        if (skills !== undefined) user.skills = skills;
        if (github !== undefined) user.github = github;
        if (linkedin !== undefined) user.linkedin = linkedin;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
