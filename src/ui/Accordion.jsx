import AccordionSummary from '@mui/material/AccordionSummary';
import { Typography } from './Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionMaterial from '@mui/material/Accordion';
import React from 'react';
import { useToggle } from '../utils/hooks/useToggle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function Accordion({ title, children }) {
  const [expanded, toggleExpand] = useToggle(true);

  return (
    <AccordionMaterial variant="sidebar" expanded={expanded} onChange={toggleExpand} disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        size="large"
      >
        <Typography variant="s" color="secondary">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails p={0} pt={1} sx={{ margin: 0, padding: '.5rem 0 0 0' }}>
        {children}
      </AccordionDetails>
    </AccordionMaterial>
  );
}
