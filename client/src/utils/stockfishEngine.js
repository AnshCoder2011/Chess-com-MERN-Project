// src/utils/stockfishEngine.js
let engine;

export const initStockfish = () => {
  if (typeof Worker !== "undefined") {
    // use dynamic import to prevent vite security issues
    engine = new Worker(
      new URL("stockfish/src/stockfish.wasm.js", import.meta.url),
      { type: "module" }
    );
  } else {
    console.error("Web Workers are not supported in this browser.");
  }
  return engine;
};

export const getBestMove = (fen) => {
  return new Promise((resolve) => {
    const stockfish = initStockfish();
    let bestMove = null;

    stockfish.onmessage = (event) => {
      const line = event.data;

      if (line.includes("bestmove")) {
        bestMove = line.split("bestmove ")[1].split(" ")[0];
        stockfish.terminate();
        resolve(bestMove);
      }
    };

    stockfish.postMessage("uci");
    stockfish.postMessage(`position fen ${fen}`);
    stockfish.postMessage("go depth 15"); // increase or decrease difficulty
  });
};
