import { Box, IconButton } from '@mui/material';
import { SupportedLocales } from 'i18n/build-dictionary';
import { SurveyUnitContactAttempt } from 'types/pearl';
import { Row } from 'ui/Row';
import { findContactAttemptLabelByValue } from 'utils/enum/ContactAttemptEnum';
import { formatDate } from 'utils/functions/date';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Typography } from 'ui/Typography';
import { MediumMessageKey } from 'i18n/mediumMessage';
import { mediumMessage } from 'i18n';

const mediumMapping: Record<string, MediumMessageKey> = {
  FIELD: 'mediumFaceToFace',
  TEL: 'mediumPhone',
  EMAIL: 'mediumEmail',
} as const;

export type MediumMappingKey = keyof typeof mediumMapping;

export interface ContactAttemptDisplayProps {
  attempt: SurveyUnitContactAttempt;
  onDelete: (a: SurveyUnitContactAttempt) => void;
}

export function ContactAttemptDisplay({ attempt, onDelete }: Readonly<ContactAttemptDisplayProps>) {
  function getMediumMessage(medium: MediumMappingKey) {
    const browserLanguage = navigator.language.split('-')[0] as SupportedLocales;

    const language = ['fr', 'en'].includes(browserLanguage) ? browserLanguage : 'en';

    const mediumKey = mediumMapping[medium];
    if (mediumKey) {
      return mediumMessage[mediumKey][language];
    }

    return mediumMessage.mediumQuestion[language];
  }

  return (
    <Box px={2} py={1.5} borderRadius={1} bgcolor="surfacePrimary.main">
      <Row justifyContent="space-between">
        <div>
          <Row gap={1}>
            <Typography color="textPrimary" variant="s" component="div">
              {findContactAttemptLabelByValue(attempt.status)}
            </Typography>
            <Typography color="textSecondary" variant="s" component="div">
              - {getMediumMessage(attempt.medium)}
            </Typography>
          </Row>
          <Typography color="textTertiary" variant="s" component="div">
            {formatDate(attempt.date, true)}
          </Typography>
        </div>
        <IconButton edge="end" onClick={() => onDelete(attempt)}>
          <DeleteOutlineIcon color="textPrimary" />
        </IconButton>
      </Row>
    </Box>
  );
}
