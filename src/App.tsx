import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import { TETROMINOES } from "./game/tetrominoes";

const ROWS = 20;
const COLS = 10;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

export default function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [piece, setPiece] = useState(TETROMINOES["T"]);
  const [pos, setPos] = useState({ x: 3, y: 0 });

  // Draw piece onto board
  const drawBoard = () => {
    const newBoard = createEmptyBoard();
    piece.forEach((row, dy) => {
      row.forEach((val, dx) => {
        if (val) {
          const y = pos.y + dy;
          const x = pos.x + dx;
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) {
            newBoard[y][x] = val;
          }
        }
      });
    });
    return newBoard;
  };

  // Game loop: piece falls every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setPos(p => ({ ...p, y: p.y + 1 }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Handle arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setPos(p => ({ ...p, x: p.x - 1 }));
      if (e.key === "ArrowRight") setPos(p => ({ ...p, x: p.x + 1 }));
      if (e.key === "ArrowDown") setPos(p => ({ ...p, y: p.y + 1 }));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Update board whenever piece or pos changes
  useEffect(() => {
    setBoard(drawBoard());
  }, [pos, piece]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <GameBoard board={board} />
    </div>
  );
}
