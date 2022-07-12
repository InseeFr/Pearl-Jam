import React, { useContext, useEffect, useState } from 'react';
import { getForm, getPreviousValue, smartForms } from './forms';

import Comments from './comments';
import Contacts from './contacts';
import D from 'i18n';
import Details from './details';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Identification from './identification';
import StateLine from './stateLine';
import SurveyUnitContext from './UEContext';
import TabSwipper from './navigation/tabSwipper';
import UeSubInfoTile from './ueSubInfoTile';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
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

const Router = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);

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
  const tabsLabels = [
    D.goToContactDetailsPage,
    D.goToIdentificationPage,
    D.goToContactPage,
    D.goToCommentsPage,
  ];
  return (
    <>
      <div>
        <StateLine />
        <TabSwipper tabsLabels={tabsLabels}>
          <UeSubInfoTile title={D.goToContactDetailsPage}>
            <Details selectFormType={selectFormType} setInjectableData={setInjectableData} />
          </UeSubInfoTile>
          <UeSubInfoTile title={D.goToIdentificationPage}>
            <Identification />
          </UeSubInfoTile>
          <UeSubInfoTile title={D.goToContactPage}>
            <Contacts selectFormType={selectFormType} setInjectableData={setInjectableData} />
          </UeSubInfoTile>
          <UeSubInfoTile title={D.goToCommentsPage}>
            <Comments />
          </UeSubInfoTile>
        </TabSwipper>
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
Router.propTypes = {};
