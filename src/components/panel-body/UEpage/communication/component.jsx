import { Dialog, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import {
  canSendCommunication,
  getRecipientInformation,
} from 'utils/functions/communicationFunctions';

import { COMMUNICATION_REQUEST_STUB } from 'utils/constants';
import { CommunicationRequestForm } from './form/CommunicationRequestForm';
import { CommunicationRequestLine } from './CommunicationRequestLine';
import D from 'i18n';
import IconButton from 'components/common/sharedComponents/IconButton';
import SurveyUnitContext from '../UEContext';
import { UserContext } from 'components/panel-body/home/UserContext';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';

const useStyles = makeStyles(() => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1em',
  },
  modalPaper: {
    boxShadow: 'unset',
    borderRadius: '15px',
    padding: '1em',
    gap: '1.5em',
    alignItems: 'center',
  },
}));

const Communication = () => {
  const classes = useStyles();
  const { surveyUnit } = useContext(SurveyUnitContext);
  const user = useContext(UserContext);
  const [isOpenModal, setOpenModal] = useState(false);

  const openModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);

  const recipientInformation = getRecipientInformation(surveyUnit);

  // TODO : remove stub when feature is finished
  const { communicationRequests = COMMUNICATION_REQUEST_STUB } = surveyUnit;
  const disabled = !canSendCommunication(surveyUnit);
  const addCommunicationRequest = communicationRequest => {
    const previousCommunicationRequests = communicationRequests ?? [];
    closeModal();
    surveyUnitIdbService.addOrUpdateSU({
      ...surveyUnit,
      communicationRequests: [...previousCommunicationRequests, communicationRequest],
    });
  };

  return (
    <>
      <div className={classes.column}>
        <IconButton
          iconType="add"
          label={D.sendCommunication}
          disabled={disabled}
          onClickFunction={openModal}
        />
        {communicationRequests?.map(mailRequest => (
          <CommunicationRequestLine key={mailRequest.status[0].date} mailRequest={mailRequest} />
        ))}
      </div>
      <Dialog
        maxWidth={false}
        className={classes.modal}
        open={isOpenModal}
        onClose={closeModal}
        disableScrollLock
        aria-labelledby="Communication-request-validation"
        aria-describedby="simple-modal-description"
        PaperProps={{ className: classes.modalPaper }}
      >
        <CommunicationRequestForm
          closeModalFunction={closeModal}
          userInformation={user}
          recipientInformation={recipientInformation}
          saveFunction={addCommunicationRequest}
        />
      </Dialog>
    </>
  );
};

export default Communication;
