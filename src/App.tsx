import { useEffect, useState } from "react";
import { TETROMINOES } from "./game/tetrominoes";
import Board from "./game/board";
import "./style.css";
import HomeScreen from "./components/homeScreen";

const HEIGHT = 20;
const WIDTH = 10;

// ---- Types ----
type Position = { row: number; col: number };
type Shape = number[][];
type BoardGrid = number[][];

export const TETROMINO_COLORS: { [key: string]: string } = {
  I: "#00ffff",
  O: "#ffff00",
  T: "#800080",
  J: "#0000ff",
  L: "#ffa500",
  S: "#00ff00",
  Z: "#ff0000",
  GHOST: "#555555",
};

// ---- Helpers ----
function createEmptyBoard(): BoardGrid {
  return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateBag(): string[] {
  return shuffle(Object.keys(TETROMINOES));
}

function getNextPiece(bag: string[]): [Shape, string, string[]] {
  let bagCopy = [...bag];
  if (bagCopy.length === 0) bagCopy = generateBag();
  const key = bagCopy[0];
  return [TETROMINOES[key], key, bagCopy.slice(1)];
}

function rotateShape(shape: Shape): Shape {
  const N = shape.length;
  const M = shape[0].length;
  const newShape: Shape = Array.from({ length: M }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < M; c++) {
      newShape[c][N - 1 - r] = shape[r][c];
    }
  }
  return newShape;
}

// ---- Component ----
export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState<BoardGrid>(createEmptyBoard);
  const [position, setPosition] = useState<Position>({ row: 0, col: 4 });
  const [shape, setShape] = useState<Shape | null>(null);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [bag, setBag] = useState<string[]>([]);
  const [holdPiece, setHoldPiece] = useState<Shape | null>(null);
  const [holdKey, setHoldKey] = useState<string | null>(null);
  const [canHold, setCanHold] = useState(true);

  const handlePlay = () => {
    setGameStarted(true);
    setGameOver(false);
    setHoldPiece(null);
    setHoldKey(null);
    setCanHold(true);

    const newBag = generateBag();
    const [firstShape, key, remainingBag] = getNextPiece(newBag);

    setShape(firstShape);
    setCurrentKey(key);
    setBag(remainingBag);
    setBoard(createEmptyBoard());
    setPosition({ row: 0, col: 4 });
  };

  function collides(testPos: Position, testShape: Shape, testBoard: BoardGrid): boolean {
    for (let r = 0; r < testShape.length; r++) {
      for (let c = 0; c < testShape[r].length; c++) {
        if (testShape[r][c]) {
          const newRow = testPos.row + r;
          const newCol = testPos.col + c;
          if (newRow >= HEIGHT || newCol < 0 || newCol >= WIDTH) return true;
          if (newRow >= 0 && testBoard[newRow][newCol]) return true;
        }
      }
    }
    return false;
  }

  function clearLines(board: BoardGrid): BoardGrid {
    const newBoard = board.filter((row) => row.some((cell) => cell === 0));
    const clearedRows = HEIGHT - newBoard.length;
    const emptyRows = Array.from({ length: clearedRows }, () => Array(WIDTH).fill(0));
    return [...emptyRows, ...newBoard];
  }

  // ---- Gravity / Locking ----
  useEffect(() => {
    if (!gameStarted || !shape || gameOver) return;

    const interval = setInterval(() => {
      const nextPos = { row: position.row + 1, col: position.col };
      if (collides(nextPos, shape, board)) {
        const newBoard = board.map((row) => [...row]);
        shape.forEach((row, r) =>
          row.forEach((val, c) => {
            if (val) {
              const boardRow = position.row + r;
              const boardCol = position.col + c;
              if (boardRow >= 0 && boardRow < HEIGHT && boardCol >= 0 && boardCol < WIDTH) {
                newBoard[boardRow][boardCol] = 1;
              }
            }
          })
        );

        const clearedBoard = clearLines(newBoard);
        setBoard(clearedBoard);

        const [nextShape, key, newBag] = getNextPiece(bag);
        const startPos = { row: 0, col: 4 };
        if (collides(startPos, nextShape, clearedBoard)) {
          setGameOver(true);
          setGameStarted(false);
          clearInterval(interval);
          return;
        }

        setShape(nextShape);
        setCurrentKey(key);
        setBag(newBag);
        setPosition(startPos);
        setCanHold(true);
      } else {
        setPosition(nextPos);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [gameStarted, shape, position, board, bag, gameOver]);

  // ---- Keyboard Controls ----
  useEffect(() => {
    if (!gameStarted || !shape || gameOver) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (!shape) return;

      // Move
      if (e.key === "ArrowLeft" || e.key === "a") {
        const nextPos = { row: position.row, col: position.col - 1 };
        if (!collides(nextPos, shape, board)) setPosition(nextPos);
      } else if (e.key === "ArrowRight" || e.key === "d") {
        const nextPos = { row: position.row, col: position.col + 1 };
        if (!collides(nextPos, shape, board)) setPosition(nextPos);
      } else if (e.key === "ArrowDown" || e.key === "s") {
        const nextPos = { row: position.row + 1, col: position.col };
        if (!collides(nextPos, shape, board)) setPosition(nextPos);
      } 
      // Rotate
      else if (e.key === "ArrowUp" || e.key === "w") {
        const rotated = rotateShape(shape);
        if (!collides(position, rotated, board)) setShape(rotated);
      } 
      // Hard drop
      else if (e.key === " " || e.code === "Space") {
        let dropRow = position.row;
        while (!collides({ row: dropRow + 1, col: position.col }, shape, board)) dropRow++;

        const newBoard = board.map((row) => [...row]);
        shape.forEach((row, r) =>
          row.forEach((val, c) => {
            if (val) {
              const boardRow = dropRow + r;
              const boardCol = position.col + c;
              if (boardRow >= 0 && boardRow < HEIGHT && boardCol >= 0 && boardCol < WIDTH) {
                newBoard[boardRow][boardCol] = 1;
              }
            }
          })
        );

        const clearedBoard = clearLines(newBoard);
        setBoard(clearedBoard);

        const [nextShape, key, newBag] = getNextPiece(bag);
        const startPos = { row: 0, col: 4 };
        if (collides(startPos, nextShape, clearedBoard)) {
          setGameOver(true);
          setGameStarted(false);
          return;
        }

        setShape(nextShape);
        setCurrentKey(key);
        setBag(newBag);
        setPosition(startPos);
        setCanHold(true);
      } 
      // Hold
      else if (e.key === "Shift" || e.key.toLowerCase() === "c") {
        if (!shape || !canHold) return;

        if (!holdPiece) {
          setHoldPiece(shape);
          setHoldKey(currentKey);
          const [nextShape, key, newBag] = getNextPiece(bag);
          setShape(nextShape);
          setCurrentKey(key);
          setBag(newBag);
        } else {
          const tempShape = holdPiece;
          const tempKey = holdKey;
          setHoldPiece(shape);
          setHoldKey(currentKey);
          setShape(tempShape);
          setCurrentKey(tempKey);
        }

        setPosition({ row: 0, col: 4 });
        setCanHold(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, shape, position, board, bag, holdPiece, holdKey, currentKey, canHold, gameOver]);

  // ---- Display Board + Ghost ----
  let ghostRow = position.row;
  if (shape) {
    while (!collides({ row: ghostRow + 1, col: position.col }, shape, board)) ghostRow++;
  }

  const displayBoard: BoardGrid = board.map((row) => [...row]);
  if (shape) {
    shape.forEach((row, r) =>
      row.forEach((val, c) => {
        if (val) {
          const boardRow = position.row + r;
          const boardCol = position.col + c;
          if (boardRow >= 0 && boardRow < HEIGHT && boardCol >= 0 && boardCol < WIDTH) {
            displayBoard[boardRow][boardCol] = 1;
          }

          const ghostBoardRow = ghostRow + r;
          if (
            ghostBoardRow >= 0 &&
            ghostBoardRow < HEIGHT &&
            boardCol >= 0 &&
            boardCol < WIDTH &&
            displayBoard[ghostBoardRow][boardCol] === 0
          ) {
            displayBoard[ghostBoardRow][boardCol] = 2; // ghost
          }
        }
      })
    );
  }

  return (
    <>
      {!gameStarted && !gameOver && <HomeScreen onPlay={handlePlay} />}
      {gameOver && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-6 text-white">
          <h1 className="text-3xl font-bold">Game Over</h1>
          <button
            onClick={handlePlay}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          >
            Play Again
          </button>
        </div>
      )}
      {gameStarted && !gameOver && (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-6">
          <Board
            board={displayBoard}
            holdPiece={holdPiece}
            holdKey={holdKey}
          />
        </div>
      )}
    </>
  );
}
