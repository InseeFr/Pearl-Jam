import Box from '@mui/material/Box';

/**
 * @param {number|string} height
 * @param {import("@mui/material").BoxProps} props
 */
export function ScrollableBox({ height, ...props }) {
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
