const dotenv = require("dotenv").config(); // 👈 FIRST LINE
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

//dotenv.config();
connectDB();

const app = express();

/* 🔥 THIS MUST COME BEFORE ROUTES */
app.use(express.json());   // 👈 MOST IMPORTANT
app.use(cors());

/* 🔥 ROUTES AFTER JSON */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("DevConnect API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

require("dotenv").config();

