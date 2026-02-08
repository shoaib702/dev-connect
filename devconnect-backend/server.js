const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); // ✅ ADD THIS
const connectDB = require("./config/db");
require("dotenv").config();
require("./config/cloudinary"); // 👈 ADD THIS
const app = express();
const server = http.createServer(app);

// ✅ EXPRESS CORS (THIS WAS MISSING)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
connectDB();

// socket.io (ye already sahi tha)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("disconnect", () => {
    for (let [k, v] of onlineUsers) {
      if (v === socket.id) onlineUsers.delete(k);
    }
  });
});

app.set("io", io);
app.set("onlineUsers", onlineUsers);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

server.listen(5000, () => console.log("Server running"));
