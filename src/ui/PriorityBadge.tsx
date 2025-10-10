import Stack from '@mui/material/Stack';
import { Typography } from './Typography';

interface PriorityBadgeProps {
  priority: boolean;
}

export function PriorityBadge({ priority }: Readonly<PriorityBadgeProps>) {
  if (!priority) {
    return null;
  }

  return (
    <Stack sx={{ marginLeft: 'auto' }} pl={2} alignItems="center">
      <Typography variant="s" color="accent">
        Prioritaire
      </Typography>
    </Stack>
  );
}
