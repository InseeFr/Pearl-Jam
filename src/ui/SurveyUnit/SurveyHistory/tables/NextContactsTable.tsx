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
} from '@mui/material';
import { CheckCircle, Delete, Edit, Add } from '@mui/icons-material';
import { Contact, SurveyUnit } from 'types/pearl';
import { CustomTableCell } from './CustomTableCell';
import { surveyUnitIDBService } from 'utils/indexeddb/services/surveyUnit-idb-service';
import { useState } from 'react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ContactModal } from './ContactModal';
import D from 'i18n';

type HouseholdTableProps = {
  surveyUnit: SurveyUnit;
};

export function NextContactsTable({ surveyUnit }: HouseholdTableProps) {
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
      houseHoldComposition:
        nextCollectHistory?.houseHoldComposition.toSpliced(selectedContactIndex, 1) ?? [],
    };
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextCollectHistory: newNextCollectHistory,
    });

    setDeleteModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const handleModify = (newContact: Contact) => {
    const newNextCollectHistory = {
      ...nextCollectHistory,
      houseHoldComposition:
        nextCollectHistory?.houseHoldComposition.toSpliced(selectedContactIndex, 1, newContact) ??
        [],
    };
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      nextCollectHistory: newNextCollectHistory,
    });

    setModifyModalOpen(false);
    setSelectedContactIndex(-1);
  };

  const nextCollectHistory = surveyUnit.nextCollectHistory;
  const handleModifyClick = (index: number) => {
    setSelectedContactIndex(index);
    setModifyModalOpen(true);
  };
  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleAdd = (newContact: Contact) => {
    surveyUnit.nextCollectHistory?.houseHoldComposition.push(newContact);
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
    });

    setAddModalOpen(false);
    setSelectedContactIndex(-1);
  };

  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -2 }}>
        {!!nextCollectHistory?.houseHoldComposition.length && (
          <Table size="medium">
            <TableHead>
              <TableRow>
                {[
                  D.tableCivility,
                  D.tableLastName,
                  D.tableFirstName,
                  D.tablePhone,
                  D.tableEmail,
                  D.tableMailContact,
                  '',
                  '',
                ].map(label => (
                  <TableCell key={label}>
                    <Typography fontWeight={600} color="grey.700">
                      {label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {nextCollectHistory?.houseHoldComposition.map((c, i) => (
                <TableRow key={i} hover>
                  <CustomTableCell>{c.civility}</CustomTableCell>
                  <CustomTableCell>{c.lastName?.toUpperCase()}</CustomTableCell>
                  <CustomTableCell>{c.firstName}</CustomTableCell>
                  <CustomTableCell>{c.phoneNumber}</CustomTableCell>
                  <CustomTableCell>{c.email}</CustomTableCell>
                  <TableCell style={{ backgroundColor: 'white', textAlign: 'center' }}>
                    {c.isMailContact && <CheckCircle fontSize="medium" color="success" />}
                  </TableCell>
                  <Button onClick={() => handleModifyClick?.(i)} size="small" variant="contained">
                    <Edit fontSize="small" />
                    <Typography fontWeight={600}>{D.edit}</Typography>{' '}
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(i)}
                    size="small"
                    variant="contained"
                    sx={{ ml: 2 }}
                  >
                    <Delete fontSize="small" />
                    <Typography fontWeight={600}>{D.delete}</Typography>{' '}
                  </Button>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Stack direction="row" mt={3}>
          <Button
            onClick={handleAddClick}
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: 'primary.dark',
              textTransform: 'none',
            }}
          >
            <Typography fontWeight={600}>{D.addContact}</Typography>{' '}
          </Button>
        </Stack>
      </CardContent>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        contactName={nextCollectHistory?.houseHoldComposition[selectedContactIndex]?.firstName}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {nextCollectHistory?.houseHoldComposition[selectedContactIndex] && (
        <ContactModal
          open={modifyModalOpen}
          modalTitle={D.contactModalTitleEdit}
          contact={nextCollectHistory?.houseHoldComposition[selectedContactIndex]}
          onClose={() => setModifyModalOpen(false)}
          onConfirm={handleModify}
        />
      )}
      <ContactModal
        modalTitle={D.contactModalTitleAdd}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleAdd}
      />
    </Card>
  );
}
