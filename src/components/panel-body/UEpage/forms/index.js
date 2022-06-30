import { deleteContactAttempt, getAddressData, getCommentByType } from 'utils/functions';

import AddressForm from './addressForm';
import ContactAttemptsForm from './contactAttemptsForm';
import ContactOutcomeForm from './contactOutcomeForm';
import IdentificationForm from './identificationForm';
import MailForm from './mailForm';
import PhoneForm from './phoneForm';
import React from 'react';
import UserForm from './userForm';
import formEnum from 'utils/enum/formEnum';
import surveyUnitIdbService from 'utils/indexeddb/services/surveyUnit-idb-service';

export const getForm = (formType, previousValue, closeModal) => {
  const saveAndClose = surveyUnit => {
    closeModal();
    surveyUnitIdbService.addOrUpdate(surveyUnit);
  };

  const deleteAndClose = (surveyUnit, contactAttempt) => {
    closeModal();
    deleteContactAttempt(surveyUnit, contactAttempt);
  };

  switch (formType) {
    case formEnum.ADDRESS:
      return (
        <AddressForm save={saveAndClose} previousValue={previousValue} closeModal={closeModal} />
      );

    case formEnum.CONTACT_ATTEMPT:
      return (
        <ContactAttemptsForm
          save={saveAndClose}
          deleteAction={deleteAndClose}
          previousValue={previousValue}
          closeModal={closeModal}
        />
      );
    case formEnum.CONTACT_OUTCOME:
      return (
        <ContactOutcomeForm
          save={saveAndClose}
          previousValue={previousValue}
          closeModal={closeModal}
        />
      );

    case formEnum.MAIL:
      return <MailForm save={saveAndClose} previousValue={previousValue} closeModal={closeModal} />;
    case formEnum.PHONE:
      return (
        <PhoneForm save={saveAndClose} previousValue={previousValue} closeModal={closeModal} />
      );
    case formEnum.USER:
      return <UserForm save={saveAndClose} previousValue={previousValue} closeModal={closeModal} />;

    case formEnum.IDENTIFICATION:
      return (
        <IdentificationForm
          save={saveAndClose}
          previousValue={previousValue}
          closeModal={closeModal}
        />
      );
    default:
      return null;
  }
};

export const getPreviousValue = (formType, surveyUnit, injectableData) => {
  let value;

  switch (formType) {
    case formEnum.ADDRESS:
      value = getAddressData(surveyUnit);
      break;
    case formEnum.USER:
      value = injectableData;
      break;
    case formEnum.MAIL:
      value = injectableData;
      break;
    case formEnum.PHONE:
      value = injectableData;
      break;
    case formEnum.COMMENT:
      value = getCommentByType('INTERVIEWER', surveyUnit);
      break;
    case formEnum.CONTACT_ATTEMPT:
      value = injectableData;
      break;
    case formEnum.CONTACT_OUTCOME:
      value = surveyUnit.contactOutcome === null ? undefined : surveyUnit.contactOutcome;
      break;
    case formEnum.IDENTIFICATION:
      value = injectableData;
      break;
    default:
      value = { titi: 'tutu' };
      break;
  }

  return value;
};

export const smartForms = [formEnum.CONTACT_ATTEMPT, formEnum.CONTACT_OUTCOME];
