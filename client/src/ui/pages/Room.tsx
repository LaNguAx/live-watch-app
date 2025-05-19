import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exitRoom } from '../../store/slices/roomSlice';

import VideoSearchModal from '../components/room/video/VideoSearchModal';
import Layout from '../components/room/Layout';
import VideoPlayer from '../components/room/video/VideoPlayer--v2';
import SideBar from '../components/room/SideBar';
import RoomDetails from '../components/room/details/RoomDetails';
import RoomHeader from '../components/room/details/RoomHeader';
import VideoSearchBar from '../components/room/video/VideoSearchBar';
import Chat from '../components/room/chat/Chat';
import SendChatMessage from '../components/room/chat/SendChatMessage';
import Button from '../components/Button';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) throw new Error('Missing roomId in URL');
  const [openModal, setOpenModal] = useState(false);

  const { emit } = useSocket(roomId);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const userName = useAppSelector((store) => store.user.name);

  useEffect(() => {
    emit('join-room', {
      roomId,
      user: {
        name: userName,
      },
    });
  }, []);

  function handleLeaveRoom() {
    navigate('/');
    dispatch(exitRoom());
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpenModal(true);
  }

  return (
    <section className="relative bg-white h-screen w-screen p-2">
      <VideoSearchModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        emitter={emit}
      >
        <Button
          className="cursor-pointer rounded-full bg-indigo-600 px-4 py-4 text-3xl w-9/12 font-medium text-white hover:bg-indigo-700 transition absolute bottom-3 left-1/2 transform -translate-x-1/2"
          type="button"
          onClick={() => setOpenModal(false)}
        >
          Close
        </Button>
      </VideoSearchModal>

      <Layout>
        <VideoPlayer emitter={emit} />

        <SideBar>
          <RoomDetails>
            <RoomHeader roomId={roomId} />
            <VideoSearchBar handleSearchModal={handleSearch} />
          </RoomDetails>

          <Chat />
          <SendChatMessage toChatRoom={roomId} emitter={emit} />

          <Button
            onClick={handleLeaveRoom}
            className=" cursor-pointer w-full rounded-full border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition text-lg mt-auto"
          >
            Leave Room
          </Button>
        </SideBar>
      </Layout>
    </section>
  );
}

// <section className="bg-white min-h-screen flex items-center p-3 sm:p-1 ">
//   <Modal
//     open={openModal}
//     onClose={() => setOpenModal(false)}
//     aria-labelledby="modal-modal-title"
//     aria-describedby="modal-modal-description"
//   >
//     <Box
//       sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: ' 90vw',
//         height: '90vh',
//         bgcolor: 'background.paper',
//         border: '2px solid #000',
//         boxShadow: 24,
//         p: 2,
//       }}
//     >
//       <div className="w-full h-full">
//         <Button onClick={() => setOpenModal(false)}>Close</Button>
//       </div>
//     </Box>
//   </Modal>
//   <div className="mx-auto max-w-screen-xl">
//     <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-center md:gap-8">
//       <div className="md:col-span-3">
//         <img
//           src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//           className="rounded"
//           alt=""
//         />
//       </div>
//       <div className="md:col-span-1 h-full flex flex-col gap-2">
//         {/* ROOM DETAILS START */}
//         <div className="max-w-lg md:max-w-none h-fit">
//           <h2 className="text-1xl font-bold text-gray-900">
//             🎥 You’re in Room {roomId}
//           </h2>
//           <p className="mt-2 text-xs text-gray-600">
//             Chat with friends, enjoy the show, and leave anytime you like.
//           </p>

//           {/* CREATE SEARCH */}
//           <form
//             onSubmit={handleSearch}
//             className="flex items-center justify-center gap-2 mt-2"
//           >
//             <input
//               type="text"
//               placeholder="Search for a video"
//               className="text-xs w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <button
//               type="submit"
//               className="cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition"
//             >
//               Search
//             </button>
//           </form>
//         </div>
//         {/* ROOM DETAILS END */}

//         {/* CREATE CHAT BOX HERE: */}
//         <article className="rounded-[10px] border border-gray-200 bg-white px-3 py-2 h-60 sm:h-96 overflow-y-auto">
//           <p className="text-[0.65rem] font-light">
//             <span className="text-xs font-medium mr-2">User 1:</span>
//             Lorem ipsum, dolor sit amet consectetur adipisicing elit.
//             Aspernatur, expedita. Lorem ipsum dolor sit amet consectetur
//             adipisicing elit. Quibusdam asperiores deserunt quidem eum a
//             autem beatae iusto aut esse iure minus ea, atque ut doloremque
//             sint ipsa debitis cum quos reiciendis illo. Iste nesciunt quia
//             aspernatur nulla, quibusdam sunt ipsum optio consectetur atque
//             corporis! Minima, ut ullam consectetur autem hic a inventore
//             ducimus iusto velit esse incidunt quas tenetur iste tempore
//             deserunt eaque. Molestias consequatur adipisci possimus minus
//             nostrum quod, distinctio numquam fuga incidunt et illo ex
//             excepturi alias. Autem, ducimus vel inventore nam harum
//             cupiditate enim cum pariatur possimus beatae temporibus nulla ex
//             fuga dolorum rem dolorem fugiat eos corporis quibusdam eius
//             fugit tenetur? Debitis earum doloremque cumque provident
//             explicabo minima ex dolore voluptates necessitatibus similique?
//             Vel sequi inventore delectus rem laudantium atque eius omnis
//             tempora officiis amet? Aperiam accusamus odit amet reiciendis
//             possimus nemo animi sapiente vel error assumenda, cum debitis
//             dolorem eos corrupti, perspiciatis, unde eaque dicta?
//           </p>
//         </article>

//         {/* <div className="mt-auto space-y-2 text-xs"> */}
//         <form
//           onSubmit={handleSendChatMessage}
//           className="flex items-center gap-2 text-xs"
//         >
//           <input
//             type="text"
//             placeholder="Type a message..."
//             className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           />
//           <button
//             type="submit"
//             className="cursor-pointer w-fit rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition"
//           >
//             Send
//           </button>
//         </form>
//         <button
//           onClick={handleLeaveRoom}
//           className="cursor-pointer w-full rounded-full border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition text-xs"
//         >
//           Leave Room
//         </button>
//       </div>
//       {/* </div> */}
//     </div>
//   </div>
// </section>

/*

<section className="bg-white min-h-screen flex items-center">
  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 w-full">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:items-center">
      
      {/* Video/Media Section 
      <div className="md:col-span-3">
        <img
          src="https://images.unsplash.com/photo-1731690415686-e68f78e2b5bd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          className="rounded-lg shadow-md w-full object-cover"
          alt="Streaming video"
        />
      </div>

      {/* Room Info + Chat 
      <div className="md:col-span-1 space-y-6">
        <div className="max-w-lg md:max-w-none">
          <h2 className="text-3xl font-bold text-gray-900">
            🎥 You’re in Room
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Chat with friends, enjoy the show, and leave anytime you like.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // handle chat submission
          }}
          className="space-y-2"
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>

        <button
          onClick={() => {
            // handle leave room
          }}
          className="w-full rounded-full border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition"
        >
          Leave Room
        </button>
      </div>
    </div>
  </div>
</section>


*/
export default Room;
