import Box from '@mui/material/Box';

export function Hr() {
  return (
    <Box
      as="hr"
      sx={{
        border: 'none',
        borderBottomColor: 'separator.main',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        margin: 0,
      }}
    />
  );
}
