import { Box, Modal } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import VideoCard from './VideoCard';
import { useIsFetching } from '@tanstack/react-query';
import Spinner from '../../Spinner';
import { EmitFunction } from '../../../../hooks/useSocket';

interface VideoSearchModalProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  emitter: EmitFunction;
}

export default function VideoSearchModal({
  openModal,
  setOpenModal,
  children,
  emitter:emit
}: VideoSearchModalProps) {
  const searchVideos = useAppSelector((store) => store.room.search.results);
  const searchQuery = useAppSelector((store) => store.room.search.query);

  const isSearching = useIsFetching({ queryKey: ['videos', searchQuery] }) > 0;
  console.log(isSearching);
  console.log('render');

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: ' 97vw',
          height: '95vh',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          borderRadius: '1rem',
          p: 2,
        }}
      >
        <div className="w-full h-full space-y-4  relative overflow-hidden rounded-2xl">
          <h2 className="text-3xl border-b border-stone-400 pb-2">
            Your search:{' '}
            <span className="font-light tracking-wide">{searchQuery}</span>
          </h2>
          <div className="overflow-y-auto h-full w-full">
            {isSearching ? (
              <Spinner />
            ) : searchVideos && searchVideos.length > 0 ? (
              searchVideos.map((video) => (
                <VideoCard
                  closeModal={() => setOpenModal(false)}
                  key={video.id}
                  video={video}
                  emitter={emit}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No results found.
              </p>
            )}
          </div>

          {children}
        </div>
      </Box>
    </Modal>
  );
}
