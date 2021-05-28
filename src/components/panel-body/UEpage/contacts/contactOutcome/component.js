import { makeStyles, Paper, Typography } from '@material-ui/core';
import { findContactOutcomeValueByType } from 'common-tools/enum/ContactOutcomEnum';
import formEnum from 'common-tools/enum/formEnum';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import SurveyUnitContext from '../../UEContext';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    marginRight: '1em',
    marginTop: '1em',
    padding: '1em',
    boxShadow: 'unset',
    border: 'LightGray solid 1px',
    borderRadius: '15px',
    minWidth: '300px',
    minHeight: '200px',
  },
  upDownMargin: {
    marginTop: '1em',
    marginBottom: '1em',
  },
}));

const ContactOutcome = ({ selectFormType }) => {
  const su = useContext(SurveyUnitContext);
  const defaultContactOutcome =
    su.contactOutcome !== undefined && su.contactOutcome !== null
      ? su.contactOutcome
      : {
          date: new Date().getTime(),
          type: undefined,
          totalNumberOfContactAttempts: '0',
        };
  const [contactOutcome, setContactOutcome] = useState(defaultContactOutcome);

  useEffect(() => {
    setContactOutcome(
      su.contactOutcome !== undefined && su.contactOutcome !== null
        ? su.contactOutcome
        : {
            date: new Date().getTime(),
            type: undefined,
            totalNumberOfContactAttempts: '0',
          }
    );
  }, [su]);

  const outcomeValue = findContactOutcomeValueByType(contactOutcome.type);
  const classes = useStyles();
  return (
    <Paper
      className={classes.column}
      onClick={() => {
        selectFormType(formEnum.CONTACT_OUTCOME, true);
      }}
    >
      <Typography variant="h6">{D.contactOutcome}</Typography>
      <Typography className={classes.upDownMargin}>{outcomeValue}</Typography>
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
