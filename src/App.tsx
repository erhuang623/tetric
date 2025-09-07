import { useEffect, useState } from "react";
import { TETROMINOES } from "./game/tetrominoes";
import Board from "./game/board";
import "./style.css"
import HomeScreen from "./components/homeScreen";

const HEIGHT = 20;
const WIDTH = 10;

function createEmptyBoard() {
  return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
}


export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(createEmptyBoard());
  
  const handlePlay = () => {
    setGameStarted(true);
  }

   return (
    <>
      {!gameStarted && <HomeScreen onPlay={handlePlay} />}
      {gameStarted && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-6">
          <Board board={board} />
        </div>
      )}
    </>
  );
}
