import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { Fragment } from 'react';
import {
  displayAgeInYears,
  getTitle,
  personPlaceholder,
  toggleFavoritePhoneNumberAndPersist,
} from '../../utils/functions';
import { useToggle } from '../../utils/hooks/useToggle';
import { Row } from '../Row';
import { TextWithLabel } from '../TextWithLabel';
import { Typography } from '../Typography';
import { PersonsForm } from './PersonsForm';
import { SurveyUnit, SurveyUnitPerson, SurveyUnitPhoneNumber } from 'types/pearl';

/**
 * Display persons linked to a survey unit
 */
export function PersonsCard({ surveyUnit }: Readonly<{ surveyUnit: SurveyUnit }>) {
  const persons = [...surveyUnit.persons].sort((a, b) => {
    if (a.privileged === b.privileged) {
      return 0;
    }
    return a.privileged ? -1 : 1;
  });
  const [showModal, toggleModal] = useToggle(false);

  if (persons.length === 0) {
    persons.push(personPlaceholder as unknown as SurveyUnitPerson);
  }

  /**
   * Toggle favorite status for a phone number
   */
  const handleFavPhoneNumber = (personId: number, phoneNumber: SurveyUnitPhoneNumber) => {
    toggleFavoritePhoneNumberAndPersist(surveyUnit, personId, phoneNumber);
  };

  return (
    <>
      <Card elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row justifyContent="space-between">
              <Row gap={1}>
                <PersonOutlineIcon fontSize="large" />
                <Typography component="h2" variant="xl" fontWeight={700}>
                  {D.surveyUnitIndividual}
                </Typography>
              </Row>
              <Button
                onClick={toggleModal}
                color="surfaceSecondary"
                variant="edge"
                startIcon={<BorderColorOutlinedIcon fontSize="small" />}
              >
                {D.editButton}
              </Button>
            </Row>
            <Row gap={4}>
              {persons.map((p, k) => (
                <Fragment key={p.id}>
                  {k > 0 && <Divider orientation="vertical" flexItem />}
                  <PersonInfo onPhoneFav={handleFavPhoneNumber} person={p} />
                </Fragment>
              ))}
            </Row>
          </Stack>
        </CardContent>
      </Card>
      {showModal && <PersonsForm persons={persons} surveyUnit={surveyUnit} onClose={toggleModal} />}
    </>
  );
}

/**
 * Display person information as a list
 */
function PersonInfo({
  person,
  onPhoneFav,
}: Readonly<{
  person: SurveyUnitPerson;
  onPhoneFav: (personId: number, phoneNumber: SurveyUnitPhoneNumber) => void;
}>) {
  const phoneNumberForSource = (source: string) =>
    person.phoneNumbers.find(n => n.source === source);
  const handleFavPhoneNumber = (phoneNumber: SurveyUnitPhoneNumber) =>
    onPhoneFav(person.id, phoneNumber);
  return (
    <Stack gap={2} sx={{ width: '100%' }}>
      <Stack gap={0.5}>
        <TextWithLabel label={D.surveyMailContact}>{person.privileged}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitTitle}>{getTitle(person.title)}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitLastName}>{person.lastName}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitFirstName}>{person.firstName}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitAge}>{displayAgeInYears(person.birthdate)}</TextWithLabel>
      </Stack>

      {/* temporary feature, mail preference will be replaced by person preference */}
      <Row
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto 20px',
        }}
      >
        <TextWithLabel
          label={D.surveyUnitEmail}
          sx={{
            maxWidth: '80%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
          }}
        >
          {person.email}
        </TextWithLabel>
      </Row>

      <Stack gap={0.5}>
        <Typography component="div" color="textTertiary" variant="s">
          {D.telephone} :
        </Typography>
        <PhoneLine
          baseId="source-fiscal"
          onFavorite={handleFavPhoneNumber}
          label={D.fiscalSource}
          phoneNumber={phoneNumberForSource('FISCAL')}
        />
        <PhoneLine
          baseId="source-directory"
          onFavorite={handleFavPhoneNumber}
          label={D.directorySource}
          phoneNumber={phoneNumberForSource('DIRECTORY')}
        />
        {person.phoneNumbers
          .filter(p => p.source === 'INTERVIEWER')
          .map((phoneNumber, k) => (
            <PhoneLine
              key={phoneNumber.id}
              baseId={`source-interviewer-${k}`}
              onFavorite={handleFavPhoneNumber}
              label={D.interviewerSource}
              phoneNumber={phoneNumber}
            />
          ))}
      </Stack>
    </Stack>
  );
}

/**
 * Displays a phone number with a star button
 */
function PhoneLine({
  label,
  phoneNumber,
  onFavorite,
  baseId,
}: Readonly<{
  label: string;
  phoneNumber?: SurveyUnitPhoneNumber;
  onFavorite: (p: SurveyUnitPhoneNumber) => void;
  baseId: string;
}>) {
  return (
    <Row
      sx={{ display: 'grid', gridTemplateColumns: '110px 110px 20px', gap: '1rem', minHeight: 24 }}
    >
      <Typography component="div" color="textHint" variant="xs">
        &nbsp; • {label} :
      </Typography>
      <Typography component="div" color="textPrimary" variant="s">
        {phoneNumber?.number ?? '-'}
      </Typography>
      {phoneNumber && (
        <IconButton
          sx={{ py: 0 }}
          id={`star-button-${baseId}`}
          onClick={() => onFavorite(phoneNumber)}
        >
          {phoneNumber.favorite ? (
            <StarIcon color="yellow" />
          ) : (
            <StarBorderIcon color="surfaceTertiary" />
          )}
        </IconButton>
      )}
    </Row>
  );
}
