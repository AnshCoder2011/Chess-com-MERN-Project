import Room from "../models/Room.js";
import User from "../models/User.js";

// Generate random 6-digit code
const generateRoomCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Create Room
export const createRoom = async (req, res) => {
  try {
    const { timerOption, userId } = req.body;

    const roomCode = generateRoomCode();
    const room = await Room.create({
      roomCode,
      players: [userId],
      timerOption,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to create room", error });
  }
};

// Join Room
export const joinRoom = async (req, res) => {
  try {
    const roomCode = req.params.roomCode;
    const userId = req.user._id; // ✅ get from auth middleware, not body

    const room = await Room.findOne({ roomCode }).populate(
      "players",
      "username"
    );
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.players.length >= 2)
      return res.status(400).json({ message: "Room is full" });

    // ✅ Convert ObjectIds to strings for comparison
    const playerIds = room.players.map((p) => p._id.toString());
    if (!playerIds.includes(userId.toString())) {
      room.players.push(userId);
      room.status = "started"; // ✅ optional: auto-start when both joined
      await room.save();
    }

    res.status(200).json({ message: "Joined room successfully", room });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: "Failed to join room", error });
  }
};


// Get Room Info
export const getRoom = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await Room.findOne({ roomCode }).populate(
      "players",
      "username"
    );
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch room", error });
  }
};
