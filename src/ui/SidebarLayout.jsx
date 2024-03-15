import Grid from '@mui/material/Grid';

/**
 * Global layout for the app with 3 sections (header, sidebar and main content)
 *
 * @param {ReactNode} children
 * @return {JSX.Element}
 */
export function SidebarLayout({ children }) {
  return (
    <Grid
      gap={4}
      p={2}
      sx={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        alignItems: 'stretch',
        height: 'calc(100vh - 90px)',
      }}
      bgcolor="surfacePrimary.main"
    >
      {children}
    </Grid>
  );
}
