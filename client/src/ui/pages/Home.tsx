import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleCreate = () => {
    const newRoom = crypto.randomUUID().slice(0, 6);
    navigate(`/room/${newRoom}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="mx-auto w-full max-w-screen-xl pt-16 pb-8 lg:pt-24">
        <div className="text-center px-2 sm:px-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
            🎬 Watch Together, From Anywhere
          </h2>

          <p className="mx-auto mt-4 max-w-md sm:max-w-xl text-gray-500 text-sm sm:text-base">
            Host real-time watch parties with friends, chat live, and enjoy
            synced videos like you're all in the same room — no matter where you
            are.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
            <button
              onClick={handleCreate}
              className="cursor-pointer w-full sm:w-auto rounded-full border border-indigo-600 px-8 py-3 text-sm font-medium hover:text-indigo-600 hover:bg-white bg-indigo-600 text-white transition"
            >
              🎉 Create a Watch Room
            </button>
            <span className="font-medium text-md">OR</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <input
                className="w-full sm:w-56 border px-4 py-2 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="cursor-pointer w-full sm:w-auto rounded-full border border-indigo-600 px-6 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Join Room 😎
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <ul className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-500">
            <li>
              <a href="#">Terms</a>
            </li>
            <li>
              <a href="#">Privacy</a>
            </li>
            <li>
              <a href="#">GitHub</a>
            </li>
          </ul>

          <p className="mt-6 sm:mt-0 text-xs text-gray-400">
            Built with ❤️ for movie lovers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
