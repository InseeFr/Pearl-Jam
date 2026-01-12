import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import { CheckCircle, Delete, Edit, Add, Refresh } from '@mui/icons-material';
import { NextContactHistoryPerson, SurveyUnit } from 'types/pearl';
import { CustomTableCell } from './CustomTableCell';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { useState } from 'react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ContactModal } from './ContactModal';
import D from 'i18n';

type HouseholdTableProps = {
  surveyUnit: SurveyUnit;
};

export function NextContactsTable({ surveyUnit }: Readonly<HouseholdTableProps>) {
  const [selectedContactIndex, setSelectedContactIndex] = useState<number>(-1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleDeleteClick = (index: number) => {
    setSelectedContactIndex(index);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const newNextCollectHistory = {
      ...nextCollectHistory,
      persons: nextCollectHistory?.persons.toSpliced(selectedContactIndex, 1) ?? [],
    };
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextContactHistory: newNextCollectHistory,
    });

    setDeleteModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const handleModify = (newContact: NextContactHistoryPerson) => {
    const newNextCollectHistory = {
      ...nextCollectHistory,
      persons: nextCollectHistory?.persons.toSpliced(selectedContactIndex, 1, newContact) ?? [],
    };
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextContactHistory: newNextCollectHistory,
    });

    setModifyModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const importPreviousContacts = () => {
    const persons = surveyUnit.previousContactHistory?.persons;

    if (!persons) return;

    persons.forEach(person => {
      const newContact: NextContactHistoryPerson = {
        firstName: person.firstName,
        lastName: person.lastName ?? '',
        title: person.title ?? 'MISTER',
        preferredContact: false,
      };

      handleAdd(newContact);
    });
  };

  const nextCollectHistory = surveyUnit.nextContactHistory;
  const handleModifyClick = (index: number) => {
    setSelectedContactIndex(index);
    setModifyModalOpen(true);
  };
  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleAdd = (newContact: NextContactHistoryPerson) => {
    setAddModalOpen(false);
    setSelectedContactIndex(-1);

    if (surveyUnit.nextContactHistory) {
      surveyUnit.nextContactHistory.persons.push(newContact);
      surveyUnitIDBService.addOrUpdateSU({
        ...surveyUnit,
      });
      return;
    }

    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextContactHistory: { persons: [newContact] },
    });
  };

  const nextContacts = nextCollectHistory?.persons;
  const preferredContact = nextContacts?.find(c => c.preferredContact);
  const selectedContact = nextContacts && nextContacts[selectedContactIndex];

  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -2 }}>
        {!!nextCollectHistory?.persons.length && (
          <Table size="medium">
            <TableHead>
              <TableRow
                sx={{
                  alignContent: 'center',
                }}
              >
                {[
                  D.contactCivilityLabel,
                  D.collectTableLastName,
                  D.collectTableFirstName,
                  D.tablePhone,
                  D.contactEmailLabel,
                  D.tableMailContact,
                ].map(label => (
                  <TableCell key={label} sx={{ backgroundColor: 'transparent', textAlign: 'left' }}>
                    <Typography fontWeight={600} color="grey.700">
                      {label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {nextCollectHistory?.persons.map((c, i) => (
                <TableRow
                  key={c.id}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent !important',
                    },
                  }}
                >
                  <CustomTableCell>{D[c.title]}</CustomTableCell>
                  <CustomTableCell>{c.lastName?.toUpperCase()}</CustomTableCell>
                  <CustomTableCell>{c.firstName}</CustomTableCell>
                  <CustomTableCell>{c.phoneNumber}</CustomTableCell>
                  <CustomTableCell>{c.email}</CustomTableCell>
                  <TableCell sx={{ backgroundColor: 'transparent', textAlign: 'center' }}>
                    {c.preferredContact && <CheckCircle fontSize="medium" color="success" />}
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: 'transparent',
                      textAlign: 'center',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          color="inherit"
                          onClick={() => handleModifyClick(i)}
                          size="small"
                          variant="contained"
                          sx={{ minWidth: '150px' }}
                        >
                          <Edit fontSize="small" />
                          <Typography fontWeight={600}>{D.edit}</Typography>
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() => handleDeleteClick(i)}
                          size="small"
                          variant="contained"
                          sx={{ minWidth: '150px' }}
                        >
                          <Delete fontSize="small" />
                          <Typography fontWeight={600}>{D.delete}</Typography>
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Stack direction="row" mt={3} spacing={2}>
          <Button
            onClick={handleAddClick}
            variant="contained"
            startIcon={<Add />}
            sx={{
              textTransform: 'none',
            }}
          >
            <Typography fontWeight={600}>{D.addContact}</Typography>
          </Button>
          <Button
            onClick={importPreviousContacts}
            color="inherit"
            variant="contained"
            startIcon={<Refresh />}
            sx={{
              textTransform: 'none',
            }}
            disabled={nextContacts && nextContacts.length > 0}
          >
            <Typography fontWeight={600}>{D.importContacts}</Typography>
          </Button>
        </Stack>
      </CardContent>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        selectedContact={selectedContact}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {nextCollectHistory?.persons[selectedContactIndex] && (
        <ContactModal
          open={modifyModalOpen}
          modalTitle={D.contactModalTitleEdit}
          contact={selectedContact}
          preferedContact={preferredContact}
          onClose={() => setModifyModalOpen(false)}
          onConfirm={handleModify}
        />
      )}
      <ContactModal
        modalTitle={D.modalAddContact}
        open={addModalOpen}
        preferedContact={preferredContact}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleAdd}
      />
    </Card>
  );
}
