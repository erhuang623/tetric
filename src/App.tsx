import { useEffect, useState } from "react";
import GameBoard from "./components/GameBoard";
import { TETROMINOES } from "./game/tetrominoes";

const ROWS = 20;
const COLS = 10;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}
export default function App() {

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">

    </div>
  );
}
