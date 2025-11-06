import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Confetti from "react-confetti";
import ChatBox from "../components/ChatBox";

const socket = io("http://localhost:4000");

const GameRoom = () => {
  const { roomCode } = useParams();
  const [room, setRoom] = useState(null);
  const [waiting, setWaiting] = useState(true);

  const [boardPosition, setBoardPosition] = useState("start");
  const [playerColor, setPlayerColor] = useState(null);
  const [turn, setTurn] = useState("w");

  const [opponentUsername, setOpponentUsername] = useState("");
  const [yourUsername, setYourUsername] = useState("");

  const [showWinModal, setShowWinModal] = useState(false);
  const [winner, setWinner] = useState("");

  const chessRef = useRef(new Chess());

  // ✅ Load user from local storage
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const user = storedUser || null;
  const username = user?.username || "You";

  // ✅ Preload sound effects
  const moveSound = useRef(new Audio("/src/assets/sounds/move.mp3"));
  const captureSound = useRef(new Audio("/src/assets/sounds/capture.mp3"));
  const checkSound = useRef(new Audio("/src/assets/sounds/check.mp3"));
  const gameEndSound = useRef(new Audio("/src/assets/sounds/game_end.mp3"));

  // Helper to play sound safely
  const playSound = (type) => {
    const sounds = {
      move: moveSound.current,
      capture: captureSound.current,
      check: checkSound.current,
      gameEnd: gameEndSound.current,
    };
    const sound = sounds[type];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {}); // Prevent browser autoplay issues
    }
  };

  // --- Fetch room details ---
  useEffect(() => {
    if (!roomCode) return;

    const fetchRoom = async () => {
      try {
        const token = user?.token;
        const { data } = await axios.get(
          `http://localhost:4000/api/rooms/${roomCode}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRoom(data);

        if (data.players?.length > 0) {
          if (data.players[0]._id === user?._id) {
            setYourUsername(data.players[0].username);
            if (data.players[1]) setOpponentUsername(data.players[1].username);
            setPlayerColor("w");
          } else if (data.players[1] && data.players[1]._id === user?._id) {
            setYourUsername(data.players[1].username);
            setOpponentUsername(data.players[0]?.username || "");
            setPlayerColor("b");
          }
        }

        if (!data.players || data.players.length < 2) {
          setWaiting(true);
          setTimeout(fetchRoom, 3000);
        } else {
          setWaiting(false);
        }
      } catch (err) {
        toast.error("Failed to load room");
      }
    };

    fetchRoom();
  }, [roomCode]);

  // --- Socket setup ---
  useEffect(() => {
    if (!roomCode) return;

    socket.emit("joinRoom", { roomCode, user });

    socket.on("roomJoined", ({ color, opponent }) => {
      const c = color === "white" ? "w" : "b";
      setPlayerColor(c);
      setTurn("w");
      if (opponent) setOpponentUsername(opponent.username || "");
      if (!yourUsername && user?.username) setYourUsername(user.username);
      toast.success(`You joined as ${color.toUpperCase()}`);
    });

    socket.on("opponentJoined", (payload) => {
      if (typeof payload === "string") setOpponentUsername(payload);
      else if (payload?.username) setOpponentUsername(payload.username);
      setWaiting(false);
      toast.success("Opponent joined! Game starts now ⚔️");
    });

    socket.on("move", ({ from, to, promotion }) => {
      try {
        const chess = chessRef.current;
        const move = chess.move({ from, to, promotion });

        if (move) {
          setBoardPosition(chess.fen());
          setTurn(chess.turn());

          // ✅ Play appropriate sounds
          if (move.captured) playSound("capture");
          else playSound("move");

          if (chess.inCheck()) playSound("check");
        }
      } catch (err) {
        console.error("Error applying opponent move:", err);
      }
    });


    socket.on("gameOver", ({ winner }) => {
      setWinner(winner);
      setShowWinModal(true);
      playSound("gameEnd");
    });

    return () => {
      socket.off("roomJoined");
      socket.off("opponentJoined");
      socket.off("move");
      socket.off("gameOver");
    };
  }, [roomCode]);

  // --- Handle Piece Drop ---
  const onDrop = (sourceSquare, targetSquare) => {
    if (!playerColor) {
      toast.warning("Waiting for color assignment...");
      return false;
    }

    if (turn !== playerColor) return false;

    const chess = chessRef.current;
    const moveObj = { from: sourceSquare, to: targetSquare, promotion: "q" };
    const move = chess.move(moveObj);

    if (!move) {
      toast.error("Illegal move");
      return false;
    }

    // ✅ Update board and turn
    setBoardPosition(chess.fen());
    setTurn(chess.turn());

    // ✅ Play sounds
    if (move.captured) playSound("capture");
    else playSound("move");

    if (chess.inCheck()) playSound("check");

    // ✅ Broadcast move
    socket.emit("move", { ...moveObj, roomCode });

    // ✅ Game end
    if (chess.isGameOver()) {
      playSound("gameEnd");

      let winnerName = "Draw";
      if (chess.isCheckmate()) {
        winnerName =
          chess.turn() === "w"
            ? opponentUsername || "Black"
            : yourUsername || "White";
      }

      setWinner(winnerName);
      setShowWinModal(true);
      socket.emit("gameOver", { roomCode, winner: winnerName });
    }

    return true;
  };



  const draggable = playerColor ? turn === playerColor : false;

  const displayOpponent =
    opponentUsername || (room?.players?.[1]?.username ?? "Opponent");
  const displayYou =
    yourUsername || (room?.players?.[0]?.username ?? username ?? "You");

  // ✅ Win Modal
  const WinModal = () => {
    const winnerColor =
      winner === "Draw"
        ? "Draw"
        : winner.toLowerCase().includes("white")
        ? "White"
        : "Black";

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50">
        <Confetti />
        <div className="relative bg-[#1b1b1b]/90 border border-[#2b2b2b] text-gray-100 rounded-2xl p-8 w-[90%] md:w-[420px] shadow-[0_0_30px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c2b28]/60 to-[#1e1d1b]/60 rounded-2xl backdrop-blur-sm" />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-[0_2px_6px_rgba(255,200,0,0.4)]">
              {winnerColor === "Draw" ? "🤝 Draw!" : `🏆 You Wins!`}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {winnerColor === "Draw"
                ? "A balanced duel — no one backs down!"
                : `You dominated the board with a flawless victory!`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold shadow-md hover:shadow-[0_0_15px_rgba(0,255,150,0.4)] transition-all"
              >
                Play Again
              </button>
              <button
                onClick={() => (window.location.href = "/home")}
                className="px-6 py-2 rounded-lg bg-[#2d2d2b] hover:bg-[#3a3a37] text-gray-300 font-semibold border border-[#4a4a46] transition-all"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#262522] to-[#1e1d1a] text-white flex flex-col items-center relative">
      <Navbar />
      <div className="flex flex-1 w-full px-4 py-10 gap-6 justify-center items-start">
        {/* Chessboard Panel */}
        <div className="flex flex-col items-center">
          <div className="bg-[#3C3A35] rounded-2xl p-6 shadow-2xl border border-[#4b4a45] max-w-lg w-full">
            {/* Opponent info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-300">
                    {displayOpponent}
                  </p>
                </div>
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-md text-sm font-semibold text-gray-200">
                {playerColor === "w" ? "Black" : "White"}
              </div>
            </div>

            {/* Chessboard */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-[#57544c]">
              <Chessboard
                id="GameBoard"
                boardWidth={450}
                position={boardPosition}
                onPieceDrop={onDrop}
                arePiecesDraggable={draggable}
                boardOrientation={playerColor === "b" ? "black" : "white"}
                customSquareStyles={{
                  ...(chessRef.current.history({ verbose: true }).length > 0 && {
                    [chessRef.current.history({ verbose: true }).slice(-1)[0]
                      .from]: {
                      backgroundColor: "rgba(255, 215, 0, 0.5)",
                    },
                    [chessRef.current.history({ verbose: true }).slice(-1)[0].to]:
                      {
                        backgroundColor: "rgba(255, 215, 0, 0.5)",
                      },
                  }),
                }}
              />
            </div>

            {/* Your info */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-700 border border-gray-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-300">
                    {displayYou}
                  </p>
                </div>
              </div>
              <div className="bg-gray-700 px-3 py-1 rounded-md text-sm font-semibold text-gray-200">
                {playerColor === "w" ? "White" : "Black"}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mt-6 text-gray-400 tracking-wider">
            Room Code: <span className="text-white">{roomCode}</span>
          </h2>
        </div>

        {/* Chat Panel - Desktop only */}
        <div className="hidden md:block w-full max-w-sm">
          <ChatBox socket={socket} roomId={roomCode} playerColor={playerColor} />
        </div>
      </div>

      {/* Chat Panel - Mobile - appears below board */}
      <div className="w-full px-4 pb-10 md:hidden">
        <ChatBox socket={socket} roomId={roomCode} playerColor={playerColor} />
      </div>

      {/* Waiting overlay */}
      {waiting && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-semibold mb-2 animate-pulse">
              Waiting for opponent to join...
            </div>
            <div className="w-12 h-12 border-4 border-t-green-500 border-gray-600 rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

      {showWinModal && <WinModal />}
    </div>
  );
};

export default GameRoom;