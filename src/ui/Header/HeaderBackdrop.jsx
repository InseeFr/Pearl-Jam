import { createPortal } from 'react-dom';
import Backdrop from '@mui/material/Backdrop';
import { theme } from '../PearlTheme';

/**
 * A backdrop with a specific index to go under the header
 */
export function HeaderBackdrop({ open }) {
  return (
    <>
      {createPortal(
        <Backdrop sx={{ zIndex: theme.zIndex.appBar - 1 }} open={open} />,
        document.body
      )}
    </>
  );
}
