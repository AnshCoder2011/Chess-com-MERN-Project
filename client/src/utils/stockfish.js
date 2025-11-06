export default class Stockfish {
  constructor() {
    this.engine = new Worker(
      "https://cdn.jsdelivr.net/npm/stockfish/src/stockfish.wasm.js"
    );
    this.engine.onmessage = (event) => this.handleMessage(event);
    this.onBestMove = null;
  }

  handleMessage(event) {
    const line = event.data;
    if (line.startsWith("bestmove")) {
      const parts = line.split(" ");
      if (this.onBestMove) this.onBestMove(parts[1]);
    }
  }

  async getBestMove(fen) {
    return new Promise((resolve) => {
      this.onBestMove = (move) =>
        resolve({
          from: move.substring(0, 2),
          to: move.substring(2, 4),
          promotion: "q",
        });
      this.engine.postMessage("position fen " + fen);
      this.engine.postMessage("go depth 15");
    });
  }
}
