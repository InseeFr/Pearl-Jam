import { createPortal } from 'react-dom';
import Backdrop from '@mui/material/Backdrop';
import { useTheme } from '@mui/material/styles';

type HeaderBackdropProps = {
  open: boolean;
};
/**
 * A backdrop with a specific index to go under the header
 */
export function HeaderBackdrop({ open }: Readonly<HeaderBackdropProps>) {
  const theme = useTheme();
  return (
    <>
      {createPortal(
        <Backdrop sx={{ zIndex: theme.zIndex.appBar - 1 }} open={open} />,
        document.body
      )}
    </>
  );
}
