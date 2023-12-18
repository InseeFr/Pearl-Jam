import { toDoEnum } from '../utils/enum/SUToDoEnum';
import Chip from '@mui/material/Chip';
import { theme } from './PearlTheme';

/**
 * @param {keyof typeof toDoEnum} status
 * @return {JSX.Element}
 */
export function StatusChip({ status }) {
  return (
    <Chip
      sx={{
        backgroundColor: status.color,
        height: 28,
        color: theme.palette.typographyprimary.main,
      }}
      slotProps={{}}
      label={status.value}
    />
  );
}
