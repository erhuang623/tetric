import { useEffect, useState } from "react";
import { TETROMINOES } from "./game/tetrominoes";
import "./style.css"
import HomeScreen from "./components/homeScreen";

const HEIGHT = 20;
const WIDTH = 10;

function createEmptyBoard() {
  return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
}
export default function App() {
  return (
    <HomeScreen />  
  );
}
