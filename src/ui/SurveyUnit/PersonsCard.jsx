import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import {
  displayAgeInYears,
  getTitle,
  personPlaceholder,
  toggleFavoritePhoneNumberAndPersist,
} from '../../utils/functions';
import React, { Fragment } from 'react';
import { TextWithLabel } from '../TextWithLabel';
import Button from '@mui/material/Button';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useToggle } from '../../utils/hooks/useToggle';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Divider from '@mui/material/Divider';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import { PersonsForm } from './PersonsForm';

/**
 * Display persons linked to a survey unit
 *
 * @param {SurveyUnit} surveyUnit
 */
export function PersonsCard({ surveyUnit }) {
  const persons = [...surveyUnit.persons].sort((a, b) => b.privileged - a.privileged);
  const [showModal, toggleModal] = useToggle(false);

  if (persons.length === 0) {
    persons.push(personPlaceholder);
  }

  /**
   * Toggle favorite status for a phone number
   *
   * @param {number} personId
   * @param {SurveyUnitPhoneNumber} phoneNumber
   */
  const handleFavPhoneNumber = (personId, phoneNumber) => {
    toggleFavoritePhoneNumberAndPersist(surveyUnit, personId, phoneNumber);
  };

  return (
    <>
      <Card p={2} elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row justifyContent="space-between">
              <Row gap={1}>
                <PersonOutlineIcon fontSize="large" />
                <Typography as="h2" variant="xl" fontWeight={700}>
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
            <Row gap={4} alignItems="start">
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
 *
 * @param {SurveyUnitPerson} person
 * @param {(personId: number, phoneNumber: SurveyUnitPhoneNumber) => void} onPhoneFav
 */
function PersonInfo({ person, onPhoneFav }) {
  const phoneNumberForSource = source => person.phoneNumbers.find(n => n.source === source);
  const handleFavPhoneNumber = phoneNumber => onPhoneFav(person.id, phoneNumber);
  return (
    <Stack gap={2} sx={{ width: '100%' }}>
      <Stack gap={0.5}>
        <TextWithLabel label={D.surveyUnitTitle}>{getTitle(person.title)}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitLastName}>{person.lastName}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitFirstName}>{person.firstName}</TextWithLabel>
        <TextWithLabel label={D.surveyUnitAge}>{displayAgeInYears(person.birthdate)}</TextWithLabel>
      </Stack>

      <TextWithLabel label={D.surveyUnitEmail}>{person.email}</TextWithLabel>

      <Stack gap={0.5}>
        <Typography as="div" color="textTertiary" variant="s">
          {D.telephone} :
        </Typography>
        <PhoneLine
          onFavorite={handleFavPhoneNumber}
          label={D.fiscalSource}
          phoneNumber={phoneNumberForSource('FISCAL')}
        />
        <PhoneLine
          onFavorite={handleFavPhoneNumber}
          label={D.directorySource}
          phoneNumber={phoneNumberForSource('DIRECTORY')}
        />
        {person.phoneNumbers
          .filter(p => p.source === 'INTERVIEWER')
          .map((phoneNumber, k) => (
            <PhoneLine
              key={`${k}.${phoneNumber.number}`}
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
 *
 * @param {SurveyUnitPhoneNumber | undefined} phoneNumber
 * @param {string} label
 * @param {(p: SurveyUnitPhoneNumber) => void} onFavorite
 * @constructor
 */
function PhoneLine({ label, phoneNumber, onFavorite }) {
  return (
    <Row
      sx={{ display: 'grid', gridTemplateColumns: '110px 110px 20px', gap: '1rem', minHeight: 24 }}
    >
      <Typography as="div" color="textHint" variant="xs">
        &nbsp; • {label} :
      </Typography>
      <Typography as="div" color="textPrimary" variant="s">
        {phoneNumber?.number ?? '-'}
      </Typography>
      {phoneNumber && (
        <IconButton sx={{ py: 0 }} onClick={() => onFavorite(phoneNumber)}>
          {phoneNumber.favorite ? (
            <StarIcon size="small" color="yellow" />
          ) : (
            <StarBorderIcon size="small" color="surfaceTertiary" />
          )}
        </IconButton>
      )}
    </Row>
  );
}
