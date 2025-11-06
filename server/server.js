import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("RockChess API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// ✅ Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {}; // { roomCode: { white: userObj, black: userObj } }

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinRoom", ({ roomCode, user }) => {
    console.log(`User ${user.username} joined room ${roomCode}`);
    socket.join(roomCode);

    // Initialize room if doesn't exist
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        white: { ...user, socketId: socket.id },
        black: null,
      };
      socket.emit("roomJoined", { color: "white", opponent: null });
    } else if (!rooms[roomCode].black) {
      rooms[roomCode].black = { ...user, socketId: socket.id };
      socket.emit("roomJoined", {
        color: "black",
        opponent: rooms[roomCode].white,
      });
      io.to(rooms[roomCode].white.socketId).emit("roomJoined", {
        color: "white",
        opponent: rooms[roomCode].black,
      });

      io.to(roomCode).emit("startGame");
    } else {
      socket.emit("roomFull");
    }
  });

  socket.on("move", ({ roomCode, from, to, promotion }) => {
    socket.to(roomCode).emit("move", { from, to, promotion });
  });

  socket.on("gameOver", ({ roomId, winner }) => {
    if (!roomId) return console.error("roomId missing in gameOver event");
    io.to(roomId).emit("gameOver", { winner });
  });



  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
