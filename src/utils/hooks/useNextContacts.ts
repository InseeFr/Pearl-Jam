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

  const persistSurveyUnit = (persons: NextContactHistoryPerson[]) => {
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

  const handleDeleteClick = (index: number) => {
    setSelectedContactIndex(index);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const updatedPersons = nextContacts?.toSpliced(selectedContactIndex, 1) ?? [];
    persistSurveyUnit(updatedPersons);
    setDeleteModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const handleModifyClick = (index: number) => {
    setSelectedContactIndex(index);
    setModifyModalOpen(true);
  };

  const handleModify = (newContact: NextContactHistoryPerson) => {
    const updatedContacts = ensureSinglePreferredContact(newContact);
    const updatedPersons = updatedContacts.toSpliced(selectedContactIndex, 1, newContact);
    persistSurveyUnit(updatedPersons);
    setModifyModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const handleAddClick = () => setAddModalOpen(true);

  const handleAdd = (newContact: NextContactHistoryPerson) => {
    setAddModalOpen(false);
    setSelectedContactIndex(-1);

    if (surveyUnit.nextContactHistory) {
      const updatedContacts = ensureSinglePreferredContact(newContact);
      persistSurveyUnit([...updatedContacts, newContact]);
    } else {
      persistSurveyUnit([newContact]);
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
      persistSurveyUnit(newContactsImportState.map(c => c.nextContactHistoryPerson));
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
    handleDeleteClick,
    handleConfirmDelete,
    handleModifyClick,
    handleModify,
    handleAddClick,
    handleAdd,
    importCurrentContacts,
    canDeleteContact,
    closeDeleteModal: () => setDeleteModalOpen(false),
    closeModifyModal: () => setModifyModalOpen(false),
    closeAddModal: () => setAddModalOpen(false),
    closePhoneNumberModal: () => setPhoneNumberModal(false),
  };
}
