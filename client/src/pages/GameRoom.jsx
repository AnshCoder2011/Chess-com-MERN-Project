import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Chessboard } from "react-chessboard";
import Navbar from "../components/Navbar";

const GameRoom = () => {
  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        const token = storedUser?.token;

        const { data } = await axios.get(
          `http://localhost:4000/api/rooms/${roomCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRoom(data);
        if (data.players.length < 2) {
          setWaiting(true);
          setTimeout(fetchRoom, 3000);
        } else {
          setWaiting(false);
          toast.success("Opponent joined! Game starts now ⚔️");
        }
      } catch (error) {
        toast.error("Failed to load room");
      }
    };

    fetchRoom();
  }, [roomCode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#262522] to-[#1e1d1a] text-white flex flex-col items-center relative">
      <Navbar />

      {/* Game container */}
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-10">
        <div className="bg-[#3C3A35] rounded-2xl p-6 shadow-2xl border border-[#4b4a45] max-w-lg w-full">
          {/* Top player area */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-500"></div>
              <div>
                <p className="font-semibold text-sm text-gray-300">
                  {room?.players?.[1]?.username || "Opponent"}
                </p>
              </div>
            </div>
            <div className="bg-gray-700 px-3 py-1 rounded-md text-sm font-semibold text-gray-200">
              Black
            </div>
          </div>

          {/* Chessboard */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-[#57544c]">
            <Chessboard id="GameBoard" boardWidth={450} />
          </div>

          {/* Bottom player area */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-500"></div>
              <div>
                <p className="font-semibold text-sm text-gray-300">
                  {room?.players?.[0]?.username || "You"}
                </p>
              </div>
            </div>
            <div className="bg-gray-700 px-3 py-1 rounded-md text-sm font-semibold text-gray-200">
              White
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 text-gray-400 tracking-wider">
          Room Code: <span className="text-white">{roomCode}</span>
        </h2>
      </div>

      {/* Waiting Overlay */}
      {waiting && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold mb-2 animate-pulse">
              Waiting for opponent to join...
            </div>
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-600 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
