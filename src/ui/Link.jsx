import { Link as RouterLink } from 'react-router-dom';
import LinkMaterial from '@mui/material/Link';

/**
 * @param {{to: string} & import('react').ComponentProps<typeof LinkMaterial>} props
 */
export function Link(props) {
  return <LinkMaterial component={RouterLink} {...props} />;
}
