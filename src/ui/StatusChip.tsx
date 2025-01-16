import { ToDoEnumValues } from '../utils/enum/SUToDoEnum';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import D from 'i18n';

interface StatusChipProps {
  status?: ToDoEnumValues;
}

export function StatusChip({ status }: Readonly<StatusChipProps>) {
  const theme = useTheme();
  return (
    <Chip
      sx={{
        backgroundColor: status?.color ?? theme.palette.primary.light,
        height: 28,
        color: theme.palette.primary.main,
        fontWeight: '600',
      }}
      label={status?.value ?? D.missingLabel}
    />
  );
}
