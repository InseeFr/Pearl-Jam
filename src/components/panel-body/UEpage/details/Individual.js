import { Paper, makeStyles } from '@material-ui/core';
import {
  displayAgeInYears,
  getTitle,
  sortPhoneNumbers,
  toggleFavoriteEmailAndPersist,
  toggleFavoritePhoneNumberAndPersist,
} from 'utils/functions';

import D from 'i18n';
import LabelledText from 'components/common/niceComponents/LabelledText';
import { LabelledTextWithClickableIcon } from 'components/common/niceComponents/LabelledTextWithClickableIcon';
import MaterialIcons from 'utils/icons/materialIcons';
import SurveyUnitContext from '../UEContext';
import { useContext } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  row: { display: 'flex', flexDirection: 'row' },
  spaceAround: {
    marginLeft: '1em',
    marginRight: '1em',
  },
}));

export const Individual = ({ person }) => {
  const classes = useStyles();
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { id, title, lastName, firstName, birthdate, email, favoriteEmail, phoneNumbers } = person;
  const { fiscalPhoneNumbers, directoryPhoneNumbers, interviewerPhoneNumbers } = sortPhoneNumbers(
    phoneNumbers
  );
  const age = displayAgeInYears(birthdate);

  const toggleFavoriteEmail = () => toggleFavoriteEmailAndPersist(surveyUnit, id);

  const toggleFavoritePhoneNumber = phoneNumber =>
    toggleFavoritePhoneNumberAndPersist(surveyUnit, id, phoneNumber);

  const favoriteIcon = (favorite, onClickFunction) => (
    <MaterialIcons
      type={favorite ? 'starFull' : 'starOutlined'}
      onClick={() => onClickFunction()}
    />
  );

  return (
    <Paper className={classes.root} elevation={0} key={`person-${id}`}>
      <LabelledText labelText={D.surveyUnitTitle} value={getTitle(title)} />

      <LabelledText labelText={D.surveyUnitLastName} value={lastName} />
      <LabelledText labelText={D.surveyUnitFirstName} value={firstName} />
      <LabelledText labelText={D.surveyUnitAge} value={age} />
      <LabelledTextWithClickableIcon
        labelText={D.surveyUnitEmail}
        value={email}
        icon={() => favoriteIcon(favoriteEmail, toggleFavoriteEmail)}
      />
      <LabelledTextWithClickableIcon
        labelText={[D.telephone, `(${D.fiscalSource})`]}
        value={fiscalPhoneNumbers?.[0].number ?? '/'}
        icon={() =>
          favoriteIcon(fiscalPhoneNumbers?.[0].favorite ?? false, () =>
            toggleFavoritePhoneNumber(fiscalPhoneNumbers?.[0].number)
          )
        }
      />
      <LabelledTextWithClickableIcon
        labelText={[D.telephone, `(${D.directorySource})`]}
        value={directoryPhoneNumbers?.[0].number ?? '/'}
        icon={() =>
          favoriteIcon(directoryPhoneNumbers?.[0].favorite ?? false, () =>
            toggleFavoritePhoneNumber(directoryPhoneNumbers?.[0].number)
          )
        }
      />

      <LabelledText
        labelText={[D.telephone, `(${D.directorySource})`]}
        value={directoryPhoneNumbers?.[0].number ?? '/'}
      />
      {(interviewerPhoneNumbers?.length > 0 &&
        interviewerPhoneNumbers.map(({ favorite, number }) => (
          <>
            <LabelledTextWithClickableIcon
              labelText={[D.telephone, `(${D.interviewerSource})`]}
              value={number}
              icon={() => favoriteIcon(favorite, () => toggleFavoritePhoneNumber(number))}
            />
          </>
        ))) || <LabelledText labelText={[D.telephone, `(${D.interviewerSource})`]} value={'/'} />}
    </Paper>
  );
};
