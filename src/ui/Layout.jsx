import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

/**
 * Global layout for the app with 3 sections (header, sidebar and main content)
 *
 * @param {ReactNode} sidebar
 * @param {ReactNode} header
 * @param {ReactNode} children
 * @return {JSX.Element}
 */
export function Layout ({ sidebar, header, children }) {
  return <Grid sx={{
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gridTemplateRows: 'min-content 1fr',
    gap: '1rem 2rem',
    width: '100%',
    height: '100vh',
  }}
  bgcolor="surfacePrimary.main">
    <Box sx={{ gridColumn: '1 / -1' }}>{header}</Box>
    <Box bgcolor='typographyaccent.main'>{sidebar}</Box>
    <Box bgcolor='typographyhint.main'>{children}</Box>
  </Grid>;
}
