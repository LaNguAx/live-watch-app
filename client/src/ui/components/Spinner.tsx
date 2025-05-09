import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Spinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <CircularProgress size="10rem" />
    </Box>
  );
}
