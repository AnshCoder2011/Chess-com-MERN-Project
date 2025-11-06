import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function SinglePlayerGame() {
  const [gamePosition, setGamePosition] = useState("start");
  const [chess] = useState(new Chess()); // ✅ Create and keep chess instance
  const [stockfish, setStockfish] = useState(null);

  useEffect(() => {
    console.log("♟ Initializing Stockfish...");
   const engine = new Worker("/engines/stockfish.js");
    setStockfish(engine);

    engine.onmessage = (event) => {
      const line = event.data.trim();
      console.log("Stockfish:", line);

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
          } else {
            console.warn("⚠️ Stockfish suggested invalid move:", move);
          }
        } catch (err) {
          console.error("❌ Invalid move error:", move, err);
        }
      }
    };

    // Clean up worker on unmount
    return () => engine.terminate();
  }, [chess]);

  const onDrop = (source, target) => {
    try {
      const move = chess.move({ from: source, to: target, promotion: "q" });
      if (move === null) return false;

      setGamePosition(chess.fen());

      if (stockfish) {
        const fen = chess.fen();
        console.log("🎯 Sending position to engine:", fen);
        stockfish.postMessage(`position fen ${fen}`);
        stockfish.postMessage("go depth 10");
      }

      return true;
    } catch (err) {
      console.error("Move error:", err);
      return false;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <center>
        <Chessboard
          position={gamePosition}
          onPieceDrop={onDrop}
          boardWidth={500}
        />
      </center>
    </div>
  );
}
