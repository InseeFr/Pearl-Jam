import DateFnsUtils from '@date-io/date-fns';
import { Fab, makeStyles, Paper, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { DatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import contactAttemptEnum from 'common-tools/enum/ContactAttemptEnum';
import surveyUnitStateEnum from 'common-tools/enum/SUStateEnum';
import { addNewState, areCaEqual, getSortedContactAttempts } from 'common-tools/functions';
import frLocale from 'date-fns/locale/fr';
import D from 'i18n';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import ContactAttemptLine from '../contacts/contactAttempts/contactAttemptLine';
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
    marginTop: 'auto',
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
    margin: 0,
  },
  root: { width: '15em', alignSelf: 'center', marginBottom: '2em' },
  input: { fontSize: 'xxx-large', paddingLeft: '0.5em' },
}));

class FrLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return this.format(date, 'd MMM yyyy', { locale: this.locale });
  }
}

const Form = ({ previousValue, save, deleteAction }) => {
  const surveyUnit = useContext(SurveyUnitContext);
  const [formIsValid, setFormIsValid] = useState(false);
  const [contactAttempt, setContactAttempt] = useState(previousValue);
  const [visiblePanel, setVisiblePanel] = useState(undefined);
  const [contactAttempts, setcontactAttempts] = useState([]);
  const [contactAttemptToDelete, setContactAttemptToDelete] = useState(undefined);

  const [selectedDate, handleDateChange] = useState(new Date());
  const isEditionMode = previousValue.status !== undefined;

  useEffect(() => {
    const sortedContactAttempts = getSortedContactAttempts(surveyUnit);
    setcontactAttempts(sortedContactAttempts);
  }, [surveyUnit]);

  const onChange = newStatus => {
    setContactAttempt({ ...contactAttempt, status: newStatus, date: new Date().getTime() });
  };

  useEffect(() => {
    const checkForm = () => {
      const { status } = contactAttempt;
      const isValid = () =>
        Object.keys(contactAttemptEnum)
          .map(enumKey => contactAttemptEnum[enumKey].type)
          .includes(status);
      if (isValid !== formIsValid) setFormIsValid(isValid);
    };

    if (contactAttempt !== undefined) checkForm();
  }, [contactAttempt, formIsValid]);

  const saveUE = async () => {
    let { contactAttempts: suContactAttempts } = surveyUnit;

    if (isEditionMode) {
      // remove previous contactAttempt
      suContactAttempts = suContactAttempts.filter(ca => !areCaEqual(ca, previousValue));
    }
    // add new/edited contactAttempt
    suContactAttempts.push({
      ...contactAttempt,
      date: selectedDate.getTime(),
    });

    // lifeCycle update
    await addNewState(surveyUnit, surveyUnitStateEnum.AT_LEAST_ONE_CONTACT.type);
    save({ ...surveyUnit, contactAttempts: suContactAttempts });
  };

  const isSelected = type => contactAttempt && contactAttempt.status === type;

  const selectContactAttemptToDelete = contactAttempt => {
    setVisiblePanel('DELETION');
    setContactAttemptToDelete(contactAttempt);
  };

  const classes = useStyles();

  const resetForm = value => {
    setVisiblePanel(value);
    setContactAttempt(undefined);
    setFormIsValid(false);
    setContactAttemptToDelete(undefined);
  };

  return (
    //* id-trick to allow closing modal if clicking on this transparent div, onClick check the id */
    <div className={classes.spacing} id="dialogRoot">
      <FormPanel title={D.contactAttempts}>
        {Array.isArray(contactAttempts) &&
          contactAttempts.length > 0 &&
          contactAttempts.map(contAtt => {
            const deleteContactAttempt = () => {
              setContactAttempt(contAtt);
              selectContactAttemptToDelete(contAtt);
            };
            const deleteParams = { deleteIsAvailable: true, deleteFunction: deleteContactAttempt };
            return (
              <ContactAttemptLine
                contactAttempt={contAtt}
                deleteParams={deleteParams}
                key={contAtt.date}
                selected={areCaEqual(contAtt, contactAttemptToDelete)}
              />
            );
          })}
        <Fab className={classes.alignEnd} aria-label="add" onClick={() => resetForm('EDITION')}>
          <AddIcon fontSize="large" />
        </Fab>
      </FormPanel>
      <FormPanel
        title={D.contactAttempt}
        hidden={visiblePanel !== 'EDITION'}
        backFunction={() => resetForm(undefined)}
      >
        {Object.values(contactAttemptEnum).map(({ value, type }) => (
          <Paper
            key={type}
            name={type}
            value={type}
            className={`${classes.contactAttempt} ${isSelected(type) ? classes.selected : ''}`}
            onClick={() => onChange(type)}
          >
            <Typography>{value}</Typography>
          </Paper>
        ))}
      </FormPanel>

      <FormPanel
        title={D.datePicking}
        hidden={!formIsValid || visiblePanel !== 'EDITION'}
        actionLabel={`✔ ${D.saveButton}`}
        actionFunction={saveUE}
        backFunction={() => resetForm('EDITION')}
      >
        <MuiPickersUtilsProvider utils={FrLocalizedUtils} locale={frLocale}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            variant="static"
            disableToolbar
          />
          <KeyboardTimePicker
            classes={{ root: classes.root }}
            value={selectedDate}
            ampm={false}
            onChange={date => handleDateChange(date)}
            keyboardIcon={<ScheduleIcon />}
            cancelLabel="Annuler"
            okLabel="Valider"
            inputProps={{ className: classes.input }}
          />
        </MuiPickersUtilsProvider>
      </FormPanel>

      <FormPanel
        title={D.contactAttemptDeletion}
        hidden={visiblePanel !== 'DELETION'}
        backFunction={() => resetForm(undefined)}
        actionFunction={() => deleteAction(surveyUnit, contactAttemptToDelete)}
        actionLabel={D.delete}
      >
        <ContactAttemptLine contactAttempt={contactAttempt} />
      </FormPanel>
    </div>
  );
};

export default Form;
Form.propTypes = {
  save: PropTypes.func.isRequired,
  deleteAction: PropTypes.func,
  previousValue: PropTypes.shape({
    date: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }),
};
Form.defaultProps = { deleteAction: undefined, previousValue: { date: new Date().getTime() } };
