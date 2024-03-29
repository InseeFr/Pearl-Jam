import React, { useContext, useEffect, useState } from 'react';

import AddIcon from '@material-ui/icons/Add';
import ContactAttempts from '../contactAttempts';
import ContactOutcomeLine from './contactOutcomeLine';
import D from 'i18n';
import { Divider } from '@material-ui/core';
import IconButton from 'components/common/sharedComponents/IconButton';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../../UEContext';
import formEnum from 'utils/enum/formEnum';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
  },
}));

const ContactOutcome = ({ selectFormType, setInjectableData }) => {
  const classes = useStyles();
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { contactAttempts } = surveyUnit;

  const defaultContactOutcome = surveyUnit.contactOutcome ?? {
    date: new Date().getTime(),
    type: undefined,
    totalNumberOfContactAttempts: '0',
  };
  const [contactOutcome, setContactOutcome] = useState(defaultContactOutcome);

  useEffect(() => {
    setContactOutcome(
      surveyUnit.contactOutcome ?? {
        date: new Date().getTime(),
        type: undefined,
        totalNumberOfContactAttempts: '0',
      }
    );
  }, [surveyUnit]);

  const isSeparator = contactOutcome.type && contactAttempts?.length > 0;

  return (
    <Paper elevation={0} className={classes.column}>
      <ContactOutcomeLine contactOutcome={contactOutcome} />
      {isSeparator && <Divider key="splitter" orientation="horizontal" />}
      <ContactAttempts selectFormType={selectFormType} setInjectableData={setInjectableData} />
      <div className={classes.row}>
        <IconButton
          iconType="add"
          label={D.addContactAttemptButton}
          onClickFunction={() => {
            selectFormType(formEnum.CONTACT_ATTEMPT, true);
          }}
        />

        <IconButton
          iconType={contactOutcome.type ? 'check' : undefined}
          label={contactOutcome.type ? D.editContactOutcomeButton : D.addContactOutcomeButton}
          startIcon={<AddIcon fontSize="large" />}
          onClickFunction={() => {
            selectFormType(formEnum.CONTACT_OUTCOME, true);
          }}
        ></IconButton>
      </div>
    </Paper>
  );
};

export default ContactOutcome;
ContactOutcome.propTypes = {
  selectFormType: PropTypes.func.isRequired,
};
