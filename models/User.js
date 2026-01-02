const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: String,
        skills: [String],
        github: String,
        linkedin: String,
        role: {
            type: String,
            enum: ["developer", "recruiter"],
            default: "developer",
        },

        // 👇 YAHI ADD KARNA HAI
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        profilePic: {
            type: String,
            default: "",
        },

        username: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
