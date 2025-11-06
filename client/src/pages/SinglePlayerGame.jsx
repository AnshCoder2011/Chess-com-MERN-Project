import React, { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { FaRobot, FaUndoAlt, FaBolt } from "react-icons/fa";

export default function SinglePlayerGame() {
  const [gamePosition, setGamePosition] = useState("start");
  const [chess] = useState(new Chess());
  const [stockfish, setStockfish] = useState(null);
  const [lastMoveSquares, setLastMoveSquares] = useState({});
  const boardRef = useRef(null);

  useEffect(() => {
    console.log("♟ Initializing Stockfish...");
    const engine = new Worker("/engines/stockfish.js");
    setStockfish(engine);

    engine.onmessage = (event) => {
      const line = event.data.trim();
      if (line.startsWith("bestmove")) {
        const parts = line.split(" ");
        const move = parts[1];
        if (!move || move.length < 4) return;

        const from = move.slice(0, 2);
        const to = move.slice(2, 4);

        try {
          const moveResult = chess.move({ from, to, promotion: "q" });
          if (moveResult) {
            setGamePosition(chess.fen());
            setLastMoveSquares({
              [from]: { backgroundColor: "rgba(255, 215, 0, 0.6)" }, // yellow highlight
              [to]: { backgroundColor: "rgba(255, 215, 0, 0.6)" },
            });
          }
        } catch (err) {
          console.error("❌ Invalid move:", move, err);
        }
      }
    };

    return () => engine.terminate();
  }, [chess]);

  const onDrop = (source, target) => {
    try {
      const move = chess.move({ from: source, to: target, promotion: "q" });
      if (move === null) return false;

      setGamePosition(chess.fen());
      setLastMoveSquares({
        [source]: { backgroundColor: "rgba(255, 215, 0, 0.6)" },
        [target]: { backgroundColor: "rgba(255, 215, 0, 0.6)" },
      });

      if (stockfish) {
        const fen = chess.fen();
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage("go depth 10");
      }

      return true;
    } catch (err) {
      console.error("Move error:", err);
      return false;
    }
  };

  const handleRestart = () => {
    chess.reset();
    setGamePosition("start");
    setLastMoveSquares({});
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#2c1e1b] via-[#3a2722] to-[#1d140f] overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-[#7b553d]/30 blur-[120px] rounded-full -top-20 -left-20"></div>
      <div className="absolute w-[600px] h-[600px] bg-[#a47148]/20 blur-[120px] rounded-full bottom-0 right-0"></div>

      <div className="relative z-10 backdrop-blur-2xl bg-[#2a1c18]/70 border border-[#3a2b26] rounded-3xl p-6 shadow-2xl flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FaRobot className="text-[#dcb67a] text-2xl" />
          <h1 className="text-[#f5e6cc] text-2xl font-semibold tracking-wide">
            Play vs AI
          </h1>
        </div>

        {/* Chessboard */}
        <div
          ref={boardRef}
          className="p-3 bg-gradient-to-b from-[#3a2722] to-[#2c1e1b] rounded-2xl shadow-lg"
        >
          <Chessboard
            position={gamePosition}
            onPieceDrop={onDrop}
            boardWidth={520}
            boardOrientation="white"
            customDarkSquareStyle={{ backgroundColor: "#b58863" }}
            customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
            arePiecesDraggable={true}
            customSquareStyles={lastMoveSquares}
            dropSquareStyle={{
              boxShadow: "inset 0 0 2px 3px #a47148",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 bg-[#4caf50] hover:bg-[#43a047] px-5 py-2 rounded-lg text-white font-semibold"
          >
            <FaUndoAlt /> Restart
          </button>
          <button
            onClick={() => alert("AI strength: Depth 10")}
            className="flex items-center gap-2 bg-[#5d4037] hover:bg-[#4e342e] px-5 py-2 rounded-lg text-[#f5e6cc] font-semibold"
          >
            <FaBolt /> AI Depth: 10
          </button>
        </div>
      </div>
    </div>
  );
}
