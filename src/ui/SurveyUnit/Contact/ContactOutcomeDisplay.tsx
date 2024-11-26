import { SupportedLocales } from 'i18n/build-dictionary';
import mediumMessage, { MediumMessageKey } from 'i18n/mediumMessage';
import { SurveyUnitContactAttempt } from 'types/pearl';

const mediumMapping = {
  FIELD: 'mediumFaceToFace' as MediumMessageKey,
  TEL: 'mediumPhone' as MediumMessageKey,
  EMAIL: 'mediumEmail' as MediumMessageKey,
} as const;
export type MediumMappingKey = keyof typeof mediumMapping;

/**
 * Display a contact attempt
 * @param {SurveyUnitContactAttempt} attempt
 * @param {(a: SurveyUnitContactAttempt) => void} onDelete
 */
export function ContactAttempt(
  attempt: SurveyUnitContactAttempt,
  onDelete: (a: SurveyUnitContactAttempt) => void
) {
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
            <Typography color="textPrimary" variant="s" as="div">
              {findContactAttemptValueByType(attempt.status)}
            </Typography>
            <Typography color="textSecondary" variant="s" as="div">
              - {getMediumMessage(attempt.medium)}
            </Typography>
          </Row>
          <Typography color="textTertiary" variant="s" as="div">
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
