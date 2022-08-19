import React, { useContext, useEffect, useState } from 'react';

import ContactAttemptLine from './contactAttemptLine';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../../UEContext';
import formEnum from 'utils/enum/formEnum';
import { getSortedContactAttempts } from 'utils/functions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
}));

const ContactAttempts = ({ selectFormType, setInjectableData }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const [contactAttempts, setcontactAttempts] = useState([]);

  useEffect(() => {
    const sortedContactAttempts = getSortedContactAttempts(surveyUnit);
    setcontactAttempts(sortedContactAttempts);
  }, [surveyUnit]);

  const classes = useStyles();

  return (
    <Paper
      elevation={0}
      className={classes.column}
      onClick={() => {
        selectFormType(formEnum.CONTACT_ATTEMPT, false);
        setInjectableData({ status: 'NOC', date: new Date().getTime() });
      }}
    >
      {Array.isArray(contactAttempts) &&
        contactAttempts.length > 0 &&
        contactAttempts.map(contAtt => <ContactAttemptLine contactAttempt={contAtt} />)}
    </Paper>
  );
};

export default ContactAttempts;
ContactAttempts.propTypes = {
  selectFormType: PropTypes.func.isRequired,
  setInjectableData: PropTypes.func.isRequired,
};
