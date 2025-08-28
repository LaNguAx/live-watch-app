import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setName } from '../../store/slices/userSlice';

function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const [text, setText] = useState('');

  const dispatch = useAppDispatch();

  const name = useAppSelector((store) => store.user.name);

  const handleJoin = () => {
    if (roomId.trim() && name.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleCreate = () => {
    if (name.trim()) {
      const newRoom = crypto.randomUUID().slice(0, 6);
      navigate(`/room/${newRoom}`);
    }
  };

  return (
    <div className="bg-white min-h-screen h-screen px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
      <div className="mx-auto w-full max-w-4xl h-full flex flex-col justify-between sm:justify-center">
        <div className="text-center px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            🎬 Watch Together, From Anywhere
          </h1>

          <p className="mx-auto mt-4 sm:mt-6 max-w-md sm:max-w-xl lg:max-w-2xl text-gray-500 text-lg sm:text-xl lg:text-xl leading-relaxed">
            Host real-time watch parties with friends, chat live, and enjoy
            synced videos like you're all in the same room — no matter where you
            are.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 sm:gap-6">
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`cursor-pointer w-full sm:w-auto rounded-full border px-8 py-3 text-lg sm:text-xl font-medium transition shadow-lg hover:shadow-xl ${
                name.trim()
                  ? 'border-indigo-600 hover:text-indigo-600 hover:bg-white bg-indigo-600 text-white'
                  : 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={!name.trim() ? 'Please set your name first' : ''}
            >
              🎉 Create a Watch Room
            </button>
            <span className="font-medium text-lg sm:text-xl text-gray-400">
              OR
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 w-full sm:w-auto">
              <input
                className="w-full sm:w-64 lg:w-72 border border-gray-300 px-4 py-3 rounded-full text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={handleJoin}
                disabled={!name.trim() || !roomId.trim()}
                className={`cursor-pointer w-full sm:w-auto rounded-full border px-6 py-3 text-lg font-medium transition shadow-sm hover:shadow-md ${
                  name.trim() && roomId.trim()
                    ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    : 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                title={
                  !name.trim()
                    ? 'Please set your name first'
                    : !roomId.trim()
                    ? 'Please enter a room code'
                    : ''
                }
              >
                Join Room 😎
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 sm:mt-12 text-center">
          {!name.trim() ? (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 sm:p-8 mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                👋 Please choose your display name
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Your friends will see this name in the watch room and chat
              </p>
              <div className="flex flex-col items-center gap-4">
                <Input
                  value={text}
                  placeholder="Enter your display name (e.g., John, Sarah, etc.)"
                  className="w-full sm:w-80 lg:w-96 border-2 border-yellow-300 px-4 py-3 rounded-full text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-sm bg-white placeholder:text-sm"
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && text.trim()) {
                      dispatch(setName(text));
                      setText('');
                    }
                  }}
                />
                <Button
                  extraClasses="!text-lg !px-8 !py-3 shadow-md hover:shadow-lg !bg-yellow-500 hover:!bg-yellow-600 !border-yellow-500 hover:!border-yellow-600"
                  onClick={() => {
                    if (text.trim()) {
                      dispatch(setName(text));
                      setText('');
                    }
                  }}
                  disabled={!text.trim()}
                >
                  Set My Name ✨
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <h4 className="text-lg sm:text-xl text-gray-700">
                👋 Hello, <strong className="text-green-600">{name}</strong>!
              </h4>
              <p className="text-gray-500 mt-2">
                You are ready to start watching videos together!
              </p>
            </div>
          )}
        </div>
        <div className="mt-auto sm:mt-16 pt-8 sm:pt-0 flex flex-col gap-6 sm:gap-8 justify-center items-center sm:flex-row sm:items-center sm:justify-between text-center sm:text-left border-t border-gray-100 sm:border-t-0">
          <ul className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4">
            <li>
              <a
                href="https://github.com/LaNguAx/live-watch-app/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-block rounded-full border border-indigo-600 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm hover:shadow-md"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="https://github.com/LaNguAx/live-watch-app/blob/main/README.md#-license"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-block rounded-full border border-indigo-600 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm hover:shadow-md"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="https://github.com/LaNguAx/live-watch-app"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer inline-block rounded-full border border-indigo-600 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition shadow-sm hover:shadow-md"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="text-lg sm:text-xl text-gray-400 font-medium">
            Built with ❤️ for movie lovers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
