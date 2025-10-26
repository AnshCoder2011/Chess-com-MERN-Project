import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, unique: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    timerOption: {
      type: String,
      enum: ["no-time", "5min", "10min"],
      default: "no-time",
    },
    status: {
      type: String,
      enum: ["waiting", "started", "finished"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
