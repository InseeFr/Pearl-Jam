import Backdrop from '@mui/material/Backdrop';
import D from 'i18n';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

type PreloaderTypes = {
  message: string;
}
export function Preloader({ message }: Readonly<PreloaderTypes>) {
  return (
    <Backdrop open sx={{ color: '#FFF' }}>
      <Stack gap={2} alignItems="center">
        <CircularProgress color="white" size="6em" />
        <Box component="h2" m={0} mt={2}>
          {D.pleaseWait}
        </Box>
        <Box component="h3" m={0} sx={{ opacity: 0.75 }} variant="m" color="textTertiary">
          {message}
        </Box>
      </Stack>
    </Backdrop>
  );
}
