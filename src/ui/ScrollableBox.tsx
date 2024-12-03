import Box, { BoxProps } from '@mui/material/Box';

type ScrollableBoxProps = {
  height: string;
} & BoxProps;

export function ScrollableBox({ height, ...props }: Readonly<ScrollableBoxProps>) {
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
