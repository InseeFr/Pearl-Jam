import { toDoEnum } from '../utils/enum/SUToDoEnum';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

/**
 * @param {keyof typeof toDoEnum} status
 * @return {JSX.Element}
 */
export function StatusChip({ status }) {
  const theme = useTheme();
  return (
    <Chip
      sx={{
        backgroundColor: status.color,
        height: 28,
        color: theme.palette.textPrimary.main,
        fontWeight: '600',
      }}
      label={status.value}
    />
  );
}
