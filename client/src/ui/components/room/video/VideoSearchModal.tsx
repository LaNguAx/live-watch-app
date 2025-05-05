import { Box, Modal } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface VideoSearchModalProps {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

export default function VideoSearchModal({
  openModal,
  setOpenModal,
  children,
}: VideoSearchModalProps) {
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
          width: ' 90vw',
          height: '90vh',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 2,
        }}
      >
        <div className="w-full h-full">{children}</div>
      </Box>
    </Modal>
  );
}
