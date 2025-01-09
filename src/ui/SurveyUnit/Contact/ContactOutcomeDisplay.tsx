import { Box } from '@mui/material';
import { ContactOutcome } from 'types/pearl';
import { Row } from 'ui/Row';
import { findContactOutcomeLabelByValue } from 'utils/enum/ContactOutcomeEnum';
import { formatDate } from 'utils/functions/date';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from 'ui/Typography';

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
          <Typography color="textPrimary" variant="s" as="div">
            {findContactOutcomeLabelByValue(contact.type)}
          </Typography>
          <Typography color="textTertiary" variant="s" as="div">
            {formatDate(contact.date)}
          </Typography>
        </div>
        <CheckCircleIcon color="success" />
      </Row>
    </Box>
  );
}
