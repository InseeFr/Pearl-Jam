import { ToDoEnumValues } from '../utils/enum/SUToDoEnum';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';

interface StatusChipProps {
  status: ToDoEnumValues;
}

/**
 * @param {ToDoEnumValues} status
 * @return {JSX.Element}
 */
export function StatusChip({ status }: Readonly<StatusChipProps>) {
  const theme = useTheme();
  return (
    <Chip
      sx={{
        backgroundColor: status.color,
        height: 28,
        color: theme.palette.primary.main,
        fontWeight: '600',
      }}
      label={status.value}
    />
  );
}
