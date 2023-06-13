import { Dialog, makeStyles } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import {
  canSendCommunication,
  getRecipientInformation,
} from 'utils/functions/communicationFunctions';

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
  const [openModal, setOpenModal] = useState(false);
  const dataStub = [
    {
      status: [{ date: 123456789000, status: 'FAILED' }],
      medium: 'MAIL',
      type: 'REMINDER',
      emiter: 'INTERVIEWER',
    },
    {
      status: [{ date: 123456000000, status: 'SUBMITTED' }],
      medium: 'EMAIL',
      type: 'NOTICE',
      emiter: 'TOOL',
    },
  ];

  const recipientInformation = getRecipientInformation(surveyUnit);

  const { communicationRequests = dataStub } = surveyUnit;
  const disabled = !canSendCommunication(surveyUnit);
  const addCommunicationRequest = communicationRequest => {
    const previousCommunicationRequests = communicationRequests ?? [];
    setOpenModal(false);
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
          onClickFunction={() => setOpenModal(true)}
        />
        {communicationRequests?.map(mailRequest => (
          <CommunicationRequestLine key={mailRequest.status[0].date} mailRequest={mailRequest} />
        ))}
      </div>
      <Dialog
        maxWidth={false}
        className={classes.modal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        disableScrollLock
        aria-labelledby="Communication-request-validation"
        aria-describedby="simple-modal-description"
        PaperProps={{ className: classes.modalPaper }}
      >
        <CommunicationRequestForm
          closeModalFunction={() => setOpenModal(false)}
          userInformation={user}
          recipientInformation={recipientInformation}
          saveFunction={addCommunicationRequest}
        />
      </Dialog>
    </>
  );
};

export default Communication;
