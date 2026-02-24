import { useState } from 'react';
import { NextContactHistoryPerson, SurveyUnit } from 'types/pearl';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { selectPhoneNumber } from 'utils/functions/contactHistory';
import { NextContactHistoryPersonAndImportState } from 'ui/SurveyUnit/SurveyHistory/tables/NextContactsTable';

export function useNextContacts(surveyUnit: SurveyUnit) {
  const [selectedContactIndex, setSelectedContactIndex] = useState<number>(-1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [contactsImportState, setContactsImportState] = useState<
    NextContactHistoryPersonAndImportState[]
  >([]);
  const [phoneNumberModal, setPhoneNumberModal] = useState(false);

  const nextCollectHistory = surveyUnit.nextContactHistory;
  const nextContacts = nextCollectHistory?.persons;
  const selectedContact = nextContacts?.[selectedContactIndex];

  const persistSurveyUnitPersonsForNextContactHistory = (persons: NextContactHistoryPerson[]) => {
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextContactHistory: { ...nextCollectHistory, persons },
    });
  };

  const ensureSinglePreferredContact = (
    newContact: NextContactHistoryPerson
  ): NextContactHistoryPerson[] => {
    const contacts = nextContacts ?? [];
    if (!newContact.preferredContact) return contacts;
    return contacts.map(c => (c === newContact ? c : { ...c, preferredContact: false }));
  };

  const openSelectedContactToDeleteModal = (index: number) => {
    setSelectedContactIndex(index);
    setDeleteModalOpen(true);
  };

  const deletedSelectedContact = () => {
    const updatedPersons = nextContacts?.toSpliced(selectedContactIndex, 1) ?? [];
    persistSurveyUnitPersonsForNextContactHistory(updatedPersons);
    setDeleteModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const openSelectedContactModal = (index: number) => {
    setSelectedContactIndex(index);
    setModifyModalOpen(true);
  };

  const modifyContactInTable = (newContact: NextContactHistoryPerson) => {
    const updatedContacts = ensureSinglePreferredContact(newContact);
    const updatedPersons = updatedContacts.toSpliced(selectedContactIndex, 1, newContact);
    persistSurveyUnitPersonsForNextContactHistory(updatedPersons);
    setModifyModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const addNewContact = (newContact: NextContactHistoryPerson) => {
    setAddModalOpen(false);
    setSelectedContactIndex(-1);

    if (surveyUnit.nextContactHistory) {
      const updatedContacts = ensureSinglePreferredContact(newContact);
      persistSurveyUnitPersonsForNextContactHistory([...updatedContacts, newContact]);
    } else {
      persistSurveyUnitPersonsForNextContactHistory([newContact]);
    }
  };

  const importCurrentContacts = () => {
    const newContactsImportState: NextContactHistoryPersonAndImportState[] = surveyUnit.persons.map(
      person => {
        const selectedPhoneNumber = selectPhoneNumber(person.phoneNumbers);
        return {
          resolved: !selectedPhoneNumber.requiresUserSelection,
          nextContactHistoryPerson: {
            firstName: person.firstName,
            lastName: person.lastName,
            title: person.title,
            email: person.email,
            preferredContact: person.privileged,
            phoneNumber: selectedPhoneNumber.requiresUserSelection
              ? undefined
              : selectedPhoneNumber.phoneNumber,
          },
        };
      }
    );

    const allResolved = newContactsImportState.every(c => c.resolved);

    if (allResolved) {
      persistSurveyUnitPersonsForNextContactHistory(
        newContactsImportState.map(c => c.nextContactHistoryPerson)
      );
      return;
    }

    setContactsImportState(newContactsImportState);
    setPhoneNumberModal(true);
  };

  const canDeleteContact = () => {
    if (nextContacts?.length === 1) return true;
    return !selectedContact?.preferredContact;
  };

  return {
    // State
    selectedContact,
    selectedContactIndex,
    deleteModalOpen,
    modifyModalOpen,
    addModalOpen,
    contactsImportState,
    phoneNumberModal,
    nextCollectHistory,
    nextContacts,
    // Actions
    openSelectedContactToDeleteModal,
    deletedSelectedContact,
    openSelectedContactModal,
    modifyContactInTable,
    addNewContact,
    importCurrentContacts,
    canDeleteContact,
    setAddModalOpen: (value: boolean) => setAddModalOpen(value),
    closeDeleteModal: () => setDeleteModalOpen(false),
    closeModifyModal: () => setModifyModalOpen(false),
    closePhoneNumberModal: () => setPhoneNumberModal(false),
  };
}
