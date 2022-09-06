import React, { useContext, useEffect, useState } from 'react';
import { getForm, getPreviousValue, smartForms } from './forms';

import AtomicInfoTile from './atomicInfoTile';
import Comments from './comments';
import ContactOutcome from './contacts/contactOutcome';
import D from 'i18n';
import Details from './details';
import Dialog from '@material-ui/core/Dialog';
import GenericTile from 'components/common/niceComponents/GenericTile';
import Grid from '@material-ui/core/Grid';
import Identification from './identification';
import MaterialIcons from 'utils/icons/materialIcons';
import Questionnaires from './questionnaires';
import StateLine from './stateLine';
import SurveyUnitContext from './UEContext';
import TabSwipper from './navigation/tabSwipper';
import formEnum from 'utils/enum/formEnum';
import { getAddressData } from 'utils/functions';
import { isIdentificationVisible } from 'utils/functions/identificationFunctions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    direction: 'row',
  },
  paperModal: {
    boxShadow: 'unset',
    backgroundColor: 'transparent',
    margin: 0,
    maxWidth: 'unset',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
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

  const identificationVisibility = isIdentificationVisible(surveyUnit);

  const selectedForm = getForm(formType, previousValue, closeModal);

  const classes = useStyles();

  const smartCloseModal = event => {
    if (event.target.id === 'dialogRoot') {
      closeModal();
    }
  };

  const smartModalClass = smartForms.includes(formType) ? classes.paperModal : '';
  const tabsLabels = [
    D.goToIdentificationPage,
    D.goToContactPage,
    D.goToCommentsPage,
    D.goToQuestionnairesPage,
  ];
  return (
    <>
      <div>
        <StateLine />
        <TabSwipper tabsLabels={tabsLabels}>
          <div className={classes.row}>
            <GenericTile
              title="Logement"
              editable
              icon={() => <MaterialIcons type="home" />}
              editionIcon={() => (
                <MaterialIcons
                  type="pen"
                  onClick={() => selectFormType(formEnum.ADDRESS, true)}
                ></MaterialIcons>
              )}
            >
              <AtomicInfoTile data={getAddressData(surveyUnit)} split={true} />
            </GenericTile>
            {identificationVisibility && (
              <GenericTile title="Repérage" icon={() => <MaterialIcons type="googles" />}>
                <Identification />
              </GenericTile>
            )}
          </div>
          <div className={classes.row}>
            <GenericTile
              title={D.surveyUnitIndividual}
              editionIcon={() => (
                <MaterialIcons
                  type="pen"
                  onClick={() => {
                    selectFormType(formEnum.USER, true);
                    setInjectableData(surveyUnit.persons);
                  }}
                ></MaterialIcons>
              )}
              icon={() => <MaterialIcons type="user" />}
            >
              <Details selectFormType={selectFormType} setInjectableData={setInjectableData} />
            </GenericTile>
            <div className={classes.column}>
              <GenericTile
                title={D.contactAttempts}
                icon={() => <MaterialIcons type="assignement" />}
                editionIcon={() => (
                  <MaterialIcons
                    type="pen"
                    onClick={() => selectFormType(formEnum.CONTACT_OUTCOME, true)}
                  ></MaterialIcons>
                )}
              >
                <ContactOutcome
                  selectFormType={selectFormType}
                  setInjectableData={setInjectableData}
                />
              </GenericTile>
            </div>
          </div>
          <GenericTile title={D.goToCommentsPage} icon={() => <MaterialIcons type="assignement" />}>
            <Comments />
          </GenericTile>
          <GenericTile
            title={D.goToQuestionnairesPage}
            icon={() => <MaterialIcons type="questionnaire" />}
          >
            <Questionnaires />
          </GenericTile>
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
