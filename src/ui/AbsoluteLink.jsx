import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

const style = {
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
  },
};

/**
 * Absolute positioned link
 * @param {string} to
 * @param {import('react').ReactNode} children
 * @return {JSX.Element}
 */
export function AbsoluteLink({ to, children }) {
  if (!to) {
    return <>{children}</>;
  }
  return (
    <Link component={RouterLink} to={to} sx={style} underline="none">
      {children}
    </Link>
  );
}
