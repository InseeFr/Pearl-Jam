import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import WarningIcon from '@material-ui/icons/Warning';

import { addNewState, isQuestionnaireAvailable, isValidForTransmission } from 'utils/functions';
import { useHistory, useParams } from 'react-router-dom';

import D from 'i18n';
import PropTypes from 'prop-types';
import SurveyUnitContext from '../UEContext';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'sticky',
    top: '10.5em',
    backgroundColor: 'white',
    borderBottom: '1px solid gray',
    height: '3em',
    boxSizing: 'unset',
  },
  button: {
    backgroundColor: theme.palette.primary.darker,
    color: 'white',
    marginRight: '1em',
  },
  tabs: {
    marginBottom: 'none',
  },
  scroller: { position: 'unset' },
}));

const Navigation = ({ match, refs }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { surveyUnit, inaccessible } = useContext(SurveyUnitContext);
  const history = useHistory();
  const { id } = useParams();
  const { detailsRef, identificationRef, lettersRef, contactsRef, commentsRef } = refs;

  const openQueen = () => {
    history.push(`/queen/survey-unit/${id}`);
  };

  const scrollTo = ref => {
    // headers element are 13.5 em high, 'normal' fontSize is 14px
    const { offsetTop } = ref.current;
    const fontSize = getComputedStyle(ref.current)['font-style'];
    const fontValue = fontSize === 'normal' ? 14 : fontSize;
    const topValue = parseFloat(offsetTop - fontValue * 13.5);
    window.scrollTo({ behavior: 'smooth', top: topValue });
  };

  const transmit = async () => {
    const newType = surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type;
    await addNewState(surveyUnit, newType);
    history.push(match.url);
  };
  const transmissionValidity = isValidForTransmission(surveyUnit);

  const classes = useStyles();

  return (
    <div className={classes.row}>
      <Tabs
        classes={{
          scroller: classes.scroller,
        }}
        className={classes.tabs}
        value={tabIndex}
        onChange={(e, index) => setTabIndex(index)}
      >
        <Tab label={D.goToContactDetailsPage} onClick={() => scrollTo(detailsRef)} />
        <Tab label={D.goToSpottingPage} onClick={() => scrollTo(identificationRef)} />
        <Tab label={D.goToMailsPage} onClick={() => scrollTo(lettersRef)} />
        <Tab label={D.goToContactPage} onClick={() => scrollTo(contactsRef)} />
        <Tab label={D.goToCommentsPage} onClick={() => scrollTo(commentsRef)} />
      </Tabs>
      <div>
        <Button
          className={classes.button}
          disabled={!isQuestionnaireAvailable(surveyUnit)(inaccessible)}
          onClick={openQueen}
          endIcon={inaccessible && <WarningIcon style={{ color: 'orange' }} />}
        >
          {D.questionnaireButton}
        </Button>
        <Tooltip title={transmissionValidity ? '' : D.transmissionInvalid}>
          <span>
            <Button disabled={!transmissionValidity} className={classes.button} onClick={transmit}>
              {D.sendButton}
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navigation;
Navigation.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  refs: PropTypes.shape({
    detailsRef: PropTypes.shape({}).isRequired,
    identificationRef: PropTypes.shape({}).isRequired,
    lettersRef: PropTypes.shape({}).isRequired,
    contactsRef: PropTypes.shape({}).isRequired,
    commentsRef: PropTypes.shape({}).isRequired,
  }).isRequired,
};
