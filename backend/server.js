const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiChatRoutes = require("./routes/aiChatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

// Load environment variables from a .env file
dotenv.config();

// Connect to the database
connectDB();

// Create an instance of express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Define routes for various parts of the API
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/aiChat", aiChatRoutes);

// Deployement Code Start
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  // Server static files from the React
  app.use(express.static(path.join(__dirname1, "/messenger/build")));

  // Handle all other routes by serving the React app's main HTML file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "messenger", "build", "index.html"));
  });
} else {
  // Default route for non-production environments
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}
// Deployement Code End

// Middleware for handling not found routes
app.use(notFound);

// Middleware for handling errors
app.use(errorHandler);

// Define the port for server to listen on
const PORT = process.env.PORT || 5000;

// Start the Express server
const server = app.listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});

// Set up Socket.IO with options
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://messenger-y472.onrender.com",
  },
});

// Handle socket.io connections
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  // Handle setup event to join a user's room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  // Handle join chat event to join a chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room: " + room);
    socket.emit("connected");
  });

  // Handle typing and stop typing events
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // Handle new message event
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // Handle disconnect event
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
