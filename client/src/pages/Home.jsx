import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [roomCode, setRoomCode] = useState(""); // to store generated room code

  // Load logged-in user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (!storedUser) navigate("/login"); // redirect if not logged in
    setUserInfo(storedUser);
  }, [navigate]);

  const handleCreateRoom = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const token = storedUser?.token;

      if (!token) {
        toast.error("You are not logged in!");
        return;
      }

     const { data } = await axios.post(
       "http://localhost:4000/api/rooms/create",
       { userId: storedUser._id }, // send user id
       { headers: { Authorization: `Bearer ${token}` } }
     );

      setRoomCode(data.roomCode);
      toast.success(`Room created! Code: ${data.roomCode}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create room");
    }
  };

const handleJoinRoom = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const token = storedUser?.token;

    if (!token) return toast.error("You are not logged in!");
    if (joinCode.length !== 6)
      return toast.error("Enter a valid 6-digit room code");

    console.log("Joining room:", joinCode);

    const { data } = await axios.post(
      `http://localhost:4000/api/rooms/join/${joinCode}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Join room response:", data);
    toast.info("Waiting for opponent to join...");
    navigate(`/game/${joinCode}`); // ✅ redirect immediately
  } catch (error) {
    console.error("Join room error:", error);
    toast.error(error.response?.data?.message || "Failed to join room");
  }
};



  const checkRoomStatus = async (roomCode) => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    const token = storedUser?.token;

    const { data } = await axios.get(
      `http://localhost:4000/api/rooms/${roomCode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (data.status === "started") {
      navigate(`/game/${roomCode}`);
    } else {
      setTimeout(() => checkRoomStatus(roomCode), 1000);
    }
  };

  const handlePlayAI = () => {
    navigate("/ai");
  };

  return (
    <div className="min-h-screen bg-[#302E2B] text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mt-16 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          Welcome to RockChess
        </h2>
        <p className="text-gray-300 text-center max-w-xl mb-10">
          Play chess with friends, challenge AI, or track your game history.
          Your chess journey starts here!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <button
            onClick={handleCreateRoom}
            className="bg-[#81B64C] hover:bg-[#6A9636] px-10 py-4 rounded-2xl font-bold text-gray-300 shadow-md transform hover:scale-105 transition duration-200"
          >
            Create Room
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="p-3 rounded-2xl bg-[#403E3C] focus:outline-none focus:ring-2 focus:ring-[#81B64C] placeholder-gray-400 w-48 px-5 text-white"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-[#81B64C] hover:bg-[#6A9636] px-6 py-3 rounded-2xl font-bold text-gray-300 transform hover:scale-105 transition duration-200"
            >
              Join
            </button>
          </div>

          <button
            onClick={handlePlayAI}
            className="bg-[#81B64C] hover:bg-[#6A9636] px-10 py-4 rounded-2xl font-bold text-gray-300 shadow-md transform hover:scale-105 transition duration-200"
          >
            Play vs AI
          </button>
        </div>

        {/* Game History Section */}
        <div className="w-full max-w-4xl bg-[#262522] rounded-3xl p-6 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-[#81B64C]">
            Game History
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                vs: "Player123",
                result: "Win",
                date: "10 Oct 2025",
                color: "text-green-400",
              },
              {
                vs: "ChessMaster",
                result: "Lose",
                date: "09 Oct 2025",
                color: "text-red-500",
              },
              {
                vs: "AI Bot",
                result: "Draw",
                date: "08 Oct 2025",
                color: "text-yellow-300",
              },
            ].map((game, index) => (
              <div
                key={index}
                className="bg-[#403E3C] p-4 rounded-2xl shadow hover:shadow-lg transition duration-200 flex flex-col items-center text-center"
              >
                <span className="font-semibold mb-2">{game.vs}</span>
                <span className={`font-bold ${game.color} mb-2`}>
                  {game.result}
                </span>
                <span className="text-gray-400 text-sm">{game.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Created Modal */}
      {roomCode && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#262522] p-6 rounded-xl shadow-2xl text-white w-80 text-center">
            <h2 className="text-2xl font-bold mb-4">Room Created!</h2>
            <p className="mb-6">
              Room Code:{" "}
              <span className="font-mono text-green-400">{roomCode}</span>
            </p>
            <button
              onClick={() => setRoomCode("")} // this will close the modal
              className="bg-[#81B64C] hover:bg-[#6A9636] px-6 py-2 rounded-2xl font-bold transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
