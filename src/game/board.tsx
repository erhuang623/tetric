type BoardProps = {
  board: number[][];
};

export default function Board({ board }: BoardProps) {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${board[0].length}, 2rem)` }}
    >
      {board.flat().map((cell, idx) => (
        <div
          key={idx}
          className={`w-8 h-8 ${cell === 0 ? "bg-gray-800" : "bg-cyan-400"} border border-gray-700`}
        />
      ))}
    </div>
  );
}
