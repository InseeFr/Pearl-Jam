import Box from '@mui/material/Box';

export function CenteredBox(props) {
  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        justifyItems: 'center',
        alignItems: 'center',
        ['& > *']: { gridArea: '1 / 1 / 1 / 1', position: 'relative' },
      }}
    />
  );
}
