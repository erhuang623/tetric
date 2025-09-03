import "./style.css"

export default function HomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 gap-6">
      <h1 className="font-goldman text-8xl font-bold text-white">Tetric</h1>
      <button className="px-6 py-3 text-2xl font-semibold text-black bg-white rounded-2xl hover:bg-gray-400 transition">
        Play
      </button>
    </div>
  );
}