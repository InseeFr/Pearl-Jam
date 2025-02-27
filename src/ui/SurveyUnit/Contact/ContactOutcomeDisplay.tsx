import { Box } from '@mui/material';
import { ContactOutcome } from 'types/pearl';
import { Row } from 'ui/Row';
import { formatDate } from 'utils/functions/date';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from 'ui/Typography';
import { findContactOutcomeLabelByValue } from 'utils/functions/contacts/ContactOutcome';

interface ContactOutcomeProps {
  contact?: ContactOutcome;
}

/**
 * Display the contact outcome
 */
export function ContactOutcomeDisplay({ contact }: Readonly<ContactOutcomeProps>) {
  if (!contact?.type) {
    return null;
  }
  return (
    <Box px={2} py={1.5} borderRadius={1} bgcolor="surfacePrimary.main">
      <Row justifyContent="space-between">
        <div>
          <Typography color="textPrimary" variant="s" component="div">
            {findContactOutcomeLabelByValue(contact.type)}
          </Typography>
          <Typography color="textTertiary" variant="s" component="div">
            {formatDate(contact.date)}
          </Typography>
        </div>
        <CheckCircleIcon color="success" />
      </Row>
    </Box>
  );
}
