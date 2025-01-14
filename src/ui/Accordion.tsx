import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionMaterial from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { PropsWithChildren } from 'react';
import { useToggle } from '../utils/hooks/useToggle';
import { Typography } from './Typography';
import { PaperOwnProps } from '@mui/material';

export function Accordion({
  title,
  children,
  variant,
  defaultOpen,
  ...props
}: Readonly<
  PropsWithChildren<{
    title: string;
    defaultOpen: boolean;
    variant: PaperOwnProps['variant'];
  }>
>) {
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
        <AccordionDetails sx={isDense ? { margin: 0, padding: '.5rem 0 0 0' } : undefined}>
          {children}
        </AccordionDetails>
      </AccordionMaterial>
    </div>
  );
}
