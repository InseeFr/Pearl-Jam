import { Fab, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import contactOutcomeEnum, {
  findContactOutcomeValueByType,
} from 'common-tools/enum/ContactOutcomEnum';
import surveyUnitStateEnum from 'common-tools/enum/SUStateEnum';
import { addNewState } from 'common-tools/functions';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import FormPanel from '../contacts/contactAttempts/formPanel';
import SurveyUnitContext from '../UEContext';

const useStyles = makeStyles(theme => ({
  contactAttempt: {
    textAlign: 'center',
    height: '2em',
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderRadius: '1em',
    backgroundColor: theme.palette.primary.main,
    marginRight: '1em',
    marginLeft: '1em',
    padding: '1em',
    '&:hover': {
      boxShadow: '0px 0px 0px 1px black',
      cursor: 'pointer',
    },
    whiteSpace: 'nowrap',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  selected: { backgroundColor: theme.palette.primary.dark },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 'xxx-large',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: '1.5em',
  },
  xxxLarge: {
    fontSize: 'xxx-large',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  spacing: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'max-content',
  },
  leftRightMargin: {
    marginLeft: '1em',
    marginRight: '1em',
  },
  topBottomMargin: {
    marginBottom: '1em',
    marginTop: '1em',
  },
}));

const Form = ({ previousValue, save }) => {
  const surveyUnit = useContext(SurveyUnitContext);
  const [formIsValid, setFormIsValid] = useState(false);
  const [contactOutcome, setContactOutcome] = useState(previousValue);
  const [secondPanelVisible, setSecondPanelVisible] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);

  const changeContactOutcomeTry = add => {
    const previousTotal = contactOutcome.totalNumberOfContactAttempts;
    const newValue = add ? previousTotal + 1 : Math.max(0, previousTotal - 1);
    setContactOutcome({ ...contactOutcome, totalNumberOfContactAttempts: newValue });
  };

  useEffect(() => {
    const checkForm = () => {
      const { type, totalNumberOfContactAttempts } = contactOutcome;
      const typeIsValid = Object.keys(contactOutcomeEnum)
        .map(enumKey => contactOutcomeEnum[enumKey].type)
        .includes(type);
      const isValid = typeIsValid && totalNumberOfContactAttempts > 0;

      if (isValid !== formIsValid) setFormIsValid(isValid);
    };
    checkForm();
  }, [contactOutcome, formIsValid]);

  const saveUE = async () => {
    const newSu = surveyUnit;
    newSu.contactOutcome = contactOutcome;
    const { type } = contactOutcome;
    // lifeCycle update
    if (type === contactOutcomeEnum.INTERVIEW_ACCEPTED.type) {
      await addNewState(surveyUnit, surveyUnitStateEnum.APPOINTMENT_MADE.type);
    } else {
      await addNewState(surveyUnit, surveyUnitStateEnum.WAITING_FOR_TRANSMISSION.type);
    }
    save(newSu);
  };
  const isSelected = type => contactOutcome && contactOutcome.type === type;

  const onChange = newStatus => {
    setContactOutcome({ ...contactOutcome, type: newStatus, date: new Date().getTime() });
  };

  const caType = contactOutcome && contactOutcome.type;
  const outcomeValue = findContactOutcomeValueByType(caType);
  const resetForm = () => {
    setSecondPanelVisible(false);
    setContactOutcome(previousValue);
  };

  useEffect(() => {
    const element = document.getElementById(contactOutcome.type);
    if (element !== null) setOffsetTop(element.offsetTop);
  }, [contactOutcome.type]);

  const classes = useStyles();

  return (
    <div className={classes.spacing} id="dialogRoot">
      <FormPanel title={D.contactOutcome}>
        <Typography>{outcomeValue}</Typography>
        <Typography className={classes.topBottomMargin}>
          {`> ${contactOutcome.totalNumberOfContactAttempts} ${D.contactOutcomeAttempts}`}
        </Typography>
        <Fab
          className={classes.alignEnd}
          aria-label="add"
          onClick={() => setSecondPanelVisible(true)}
        >
          <AddIcon fontSize="large" />
        </Fab>
      </FormPanel>
      <FormPanel
        title={D.contactOutcomeValidation}
        hidden={!secondPanelVisible}
        backFunction={resetForm}
        actionFunction={saveUE}
        actionLabel={D.addButton}
        actionDisabled={!formIsValid}
      >
        <Grid container>
          <div>
            {Object.values(contactOutcomeEnum).map(({ value, type }) => (
              <Paper
                id={type}
                key={type}
                name={type}
                value={type}
                className={`${classes.contactAttempt} ${isSelected(type) ? classes.selected : ''}`}
                onClick={() => onChange(type)}
              >
                <Typography>{value}</Typography>
              </Paper>
            ))}
          </div>
          <div
            className={classes.flexRow}
            style={{ marginTop: offsetTop > 0 ? offsetTop - 96 : offsetTop }}
          >
            <Fab
              size="small"
              aria-label="remove contact attempts total"
              onClick={() => changeContactOutcomeTry(false)}
            >
              <RemoveIcon />
            </Fab>

            <Typography className={classes.leftRightMargin} variant="h6">
              {contactOutcome.totalNumberOfContactAttempts}
            </Typography>
            <Fab
              size="small"
              aria-label="add contact attempt total"
              onClick={() => changeContactOutcomeTry(true)}
            >
              <AddIcon />
            </Fab>
          </div>
        </Grid>
      </FormPanel>
    </div>
  );
};

export default Form;
Form.propTypes = {
  surveyUnit: PropTypes.shape({
    contactAttempts: PropTypes.arrayOf(PropTypes.shape({})),
    id: PropTypes.string,
    campaign: PropTypes.string,
  }).isRequired,
  save: PropTypes.func.isRequired,
  previousValue: PropTypes.shape({
    date: PropTypes.number.isRequired,
    type: PropTypes.string,
    totalNumberOfContactAttempts: PropTypes.string,
  }),
};
Form.defaultProps = {
  previousValue: { date: new Date().getTime(), totalNumberOfContactAttempts: 0, type: undefined },
};
