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
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleCreate = () => {
    const newRoom = crypto.randomUUID().slice(0, 6);
    navigate(`/room/${newRoom}`);
  };

  return (
    <div className="bg-white h-screen px-4 sm:px-6 pt-12 pb-6">
      <div className="mx-auto w-full max-w-screen h-full flex flex-col sm:flex sm:flex-col sm:items-center sm:justify-center">
        <div className="text-center px-2 ">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
            🎬 Watch Together, From Anywhere
          </h2>

          <p className="mx-auto mt-4 max-w-md sm:max-w-xl text-gray-500 text-xl sm:text-base">
            Host real-time watch parties with friends, chat live, and enjoy
            synced videos like you're all in the same room — no matter where you
            are.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
            <button
              onClick={handleCreate}
              className="cursor-pointer w-full sm:w-auto rounded-full border border-indigo-600 px-8 py-3 text-xl font-medium hover:text-indigo-600 hover:bg-white bg-indigo-600 text-white transition"
            >
              🎉 Create a Watch Room
            </button>
            <span className="font-medium text-lg">OR</span>
            <div className="flex flex-row sm:items-center gap-2 w-full sm:w-auto">
              <input
                className="w-full sm:w-56 border px-4 py-2 rounded-full text-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Room Code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="cursor-pointer min-w-fit sm:w-auto rounded-full border border-indigo-600 px-6 py-2 text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Join Room 😎
              </button>
            </div>
          </div>
        </div>

        <div className="space-x-2 space-y-4 mx-auto mt-28 text-center">
          <h4 className="text-xl">
            Hi, Your name is <strong>{name ?? '?'}</strong>
          </h4>
          <div className="flex flex-col items-center gap-3">
            <Input
              value={text}
              placeholder="Enter Your Name"
              className="w-fit sm:w-56  border px-4 py-2 rounded-full text-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              extraClasses="!text-lg"
              onClick={() => {
                dispatch(setName(text));
              }}
            >
              Change Name
            </Button>
          </div>
        </div>
        <div className="mt-auto sm:mt-12 h-fit  flex flex-col gap-7 justify-center items-center sm:flex-row sm:items-center sm:justify-between text-center sm:text-left">
          <ul className="flex flex-wrap justify-center sm:justify-start gap-4 text-lg text-gray-500">
            <li>
              <a
                href="#"
                className="cursor-pointer min-w-fit sm:w-auto rounded-full border border-indigo-600 px-6 py-2 text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-pointer min-w-fit sm:w-auto rounded-full border border-indigo-600 px-6 py-2 text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-pointer min-w-fit sm:w-auto rounded-full border border-indigo-600 px-6 py-2 text-md font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
              >
                GitHub
              </a>
            </li>
          </ul>
          <p className="sm:mt-0 text-xl text-gray-400">
            Built with ❤️ for movie lovers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
