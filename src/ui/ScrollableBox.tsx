import Box from '@mui/material/Box';
import { ComponentPropsWithoutRef } from 'react';

export function ScrollableBox({ height, ...props }: Readonly<{ height: number | string } & ComponentPropsWithoutRef<typeof Box>>) {
  return (
    <Box
      {...props}
      sx={{
        height: height,
        overflow: 'auto',
        marginRight: '-.5rem',
        paddingRight: '.5rem',
        ...props.sx,
      }}
    />
  );
}
