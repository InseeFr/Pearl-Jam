import AccordionSummary from '@mui/material/AccordionSummary';
import { Typography } from './Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionMaterial from '@mui/material/Accordion';
import { useToggle } from '../utils/hooks/useToggle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 *
 * @param {string} title
 * @param {import('react').ReactNode} children
 * @param {"dense"} [variant]
 * @param {boolean} [defaultOpen]
 * @return {JSX.Element}
 */
export function Accordion({ title, children, variant, defaultOpen, ...props }) {
  const [expanded, toggleExpand] = useToggle(!!defaultOpen);
  const isDense = variant === 'dense';

  return (
    <div>
      <AccordionMaterial
        variant={variant}
        expanded={expanded}
        onChange={toggleExpand}
        disableGutters
        {...props}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography variant="s" color="textPrimary">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails pt={1} sx={isDense ? { margin: 0, padding: '.5rem 0 0 0' } : undefined}>
          {children}
        </AccordionDetails>
      </AccordionMaterial>
    </div>
  );
}
