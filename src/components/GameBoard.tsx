type GameBoardProps = {
  board: number[][];
};

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export default function GameBoard({ board }: GameBoardProps) {
  return (
    <div className="inline-grid bg-gray-800 p-2 rounded-lg"
         style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}>
      {board.flat().map((cell, idx) => (
        <div
          key={idx}
          className={`w-6 h-6 border border-gray-700 ${
            cell ? "bg-blue-500" : "bg-gray-900"
          }`}
        />
      ))}
    </div>
  );
}
