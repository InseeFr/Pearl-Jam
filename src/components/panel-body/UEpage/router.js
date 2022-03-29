import React, { useContext, useEffect, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import { getForm, getPreviousValue, smartForms } from './forms';
import Comments from './comments';
import Contacts from './contacts';
import D from 'i18n';
import Details from './details';
import Identification from './identification';
import Letters from './letters';
import Navigation from './navigation/component';
import PropTypes from 'prop-types';
import StateLine from './stateLine';
import SurveyUnitContext from './UEContext';
import UeSubInfoTile from './ueSubInfoTile';

const useStyles = makeStyles(() => ({
  ajustScroll: {
    height: 'calc(100vh - 13.5em)',
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    flexWrap: 'nowrap',
  },
  paperModal: {
    boxShadow: 'unset',
    backgroundColor: 'transparent',
    margin: 0,
    maxWidth: 'unset',
  },
}));

const Router = ({ match }) => {
  const { surveyUnit } = useContext(SurveyUnitContext);

  /** refs are used for scrolling, dispatched to the clickable link and linked element */
  const detailsRef = useRef('details');
  const identificationRef = useRef('spotting');
  const lettersRef = useRef('letters');
  const contactsRef = useRef('contacts');
  const commentsRef = useRef('comments');
  const refs = { detailsRef, identificationRef, lettersRef, contactsRef, commentsRef };

  /** Form type is dynamically inserted in Modal, with previousValue for edition if needed */
  const [formType, setFormType] = useState(undefined);
  const [editionMode, setEditionMode] = useState(false);
  const [previousValue, setPreviousValue] = useState(undefined);
  const [injectableData, setInjectableData] = useState(undefined);
  const [openModal, setOpenModal] = useState(false);

  /** update the previousValue */
  useEffect(() => {
    let value;
    if (editionMode) {
      value = getPreviousValue(formType, surveyUnit, injectableData);
    }
    setPreviousValue(value);
  }, [formType, editionMode, surveyUnit, injectableData]);

  /** double setter given to sub-components */
  const selectFormType = (newFormType, isEditionMode) => {
    setFormType(newFormType);
    setEditionMode(isEditionMode);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const selectedForm = getForm(formType, previousValue, closeModal);

  const classes = useStyles();

  const smartCloseModal = event => {
    if (event.target.id === 'dialogRoot') {
      closeModal();
    }
  };

  const smartModalClass = smartForms.includes(formType) ? classes.paperModal : '';

  return (
    <>
      <div>
        <StateLine />
        <Navigation refs={refs} match={match} />
        <div>
          <UeSubInfoTile reference={detailsRef} title={D.goToContactDetailsPage}>
            <Details selectFormType={selectFormType} setInjectableData={setInjectableData} />
          </UeSubInfoTile>
          <UeSubInfoTile reference={identificationRef} title={D.goToSpottingPage}>
            <Identification selectFormType={selectFormType} />
          </UeSubInfoTile>
          <UeSubInfoTile reference={lettersRef} title={D.goToMailsPage}>
            <Letters selectFormType={selectFormType} />
          </UeSubInfoTile>
          <UeSubInfoTile reference={contactsRef} title={D.goToContactPage}>
            <Contacts selectFormType={selectFormType} setInjectableData={setInjectableData} />
          </UeSubInfoTile>
          <UeSubInfoTile
            reference={commentsRef}
            title={D.goToCommentsPage}
            className={classes.ajustScroll}
          >
            <Comments />
          </UeSubInfoTile>
        </div>
      </div>
      <Dialog
        maxWidth={false}
        className={classes.modal}
        open={openModal}
        onClose={closeModal}
        disableScrollLock
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        PaperProps={{ className: smartModalClass, onClick: smartCloseModal }}
      >
        <Grid container className={classes.row}>
          {selectedForm !== undefined && selectedForm}
        </Grid>
      </Dialog>
    </>
  );
};

export default Router;
Router.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};
