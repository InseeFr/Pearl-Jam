import React, { useContext, useEffect, useState } from 'react';

import D from 'i18n';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../../UEContext';
import Typography from '@material-ui/core/Typography';
import { findContactOutcomeValueByType } from 'utils/enum/ContactOutcomeEnum';
import formEnum from 'utils/enum/formEnum';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    alignItems: 'center',
  },
}));

const ContactOutcome = ({ selectFormType }) => {
  const contextSu = useContext(SurveyUnitContext);
  const { surveyUnit } = contextSu;

  const defaultContactOutcome = surveyUnit.contactOutcome ?? {
    date: new Date().getTime(),
    type: undefined,
    totalNumberOfContactAttempts: '0',
  };
  const [contactOutcome, setContactOutcome] = useState(defaultContactOutcome);

  useEffect(() => {
    setContactOutcome(
      surveyUnit.contactOutcome !== undefined && surveyUnit.contactOutcome !== null
        ? surveyUnit.contactOutcome
        : {
            date: new Date().getTime(),
            type: undefined,
            totalNumberOfContactAttempts: '0',
          }
    );
  }, [surveyUnit]);

  const outcomeValue = findContactOutcomeValueByType(contactOutcome.type);
  const classes = useStyles();
  return (
    <Paper
      elevation={0}
      className={classes.column}
      onClick={() => {
        selectFormType(formEnum.CONTACT_OUTCOME, true);
      }}
    >
      <Typography>{outcomeValue}</Typography>
      <Typography>
        {contactOutcome.totalNumberOfContactAttempts > 0 &&
          `> ${contactOutcome.totalNumberOfContactAttempts} ${D.contactOutcomeAttempts}`}
      </Typography>
    </Paper>
  );
};

export default ContactOutcome;
ContactOutcome.propTypes = {
  selectFormType: PropTypes.func.isRequired,
};
