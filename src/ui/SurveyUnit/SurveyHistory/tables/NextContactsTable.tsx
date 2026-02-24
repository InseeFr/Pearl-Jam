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
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ContactModal } from './ContactModal';
import D from 'i18n';
import { PhoneNumberImportAlert } from './PhoneNumberImportAlert';
import { useNextContacts } from 'utils/hooks/useNextContacts';

type HouseholdTableProps = {
  surveyUnit: SurveyUnit;
};

export type NextContactHistoryPersonAndImportState = {
  resolved: boolean;
  nextContactHistoryPerson: NextContactHistoryPerson;
};

export function NextContactsTable({ surveyUnit }: Readonly<HouseholdTableProps>) {
  const {
    selectedContact,
    selectedContactIndex,
    deleteModalOpen,
    modifyModalOpen,
    addModalOpen,
    contactsImportState,
    phoneNumberModal,
    nextCollectHistory,
    nextContacts,
    openDeleteModalForSelectedContact: openSelectedContactToDeleteModal,
    deleteSelectedContact: deletedSelectedContact,
    openSelectedContactModal,
    modifyContactInTable,
    setAddModalOpen,
    addNewContact,
    importCurrentContacts,
    canDeleteContact,
    closeDeleteModal,
    closeModifyModal,
    closePhoneNumberModal,
  } = useNextContacts(surveyUnit);

  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -2 }}>
        {!!nextCollectHistory?.persons.length && (
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ alignContent: 'center' }}>
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
                  sx={{ '&:hover': { backgroundColor: 'transparent !important' } }}
                >
                  <CustomTableCell>{D[c.title]}</CustomTableCell>
                  <CustomTableCell>{c.lastName?.toUpperCase()}</CustomTableCell>
                  <CustomTableCell>{c.firstName}</CustomTableCell>
                  <CustomTableCell>{c.phoneNumber}</CustomTableCell>
                  <CustomTableCell>{c.email}</CustomTableCell>
                  <TableCell sx={{ backgroundColor: 'transparent', textAlign: 'center' }}>
                    {c.preferredContact && <CheckCircle fontSize="medium" color="success" />}
                  </TableCell>
                  <TableCell sx={{ backgroundColor: 'transparent', textAlign: 'center' }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button
                          color="inherit"
                          onClick={() => openSelectedContactModal(i)}
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
                          onClick={() => openSelectedContactToDeleteModal(i)}
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
            onClick={() => setAddModalOpen(true)}
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: 'none' }}
          >
            <Typography fontWeight={600}>{D.addContact}</Typography>
          </Button>
          {!nextContacts?.length && (
            <Button
              onClick={importCurrentContacts}
              color="inherit"
              variant="contained"
              startIcon={<Refresh />}
              sx={{ textTransform: 'none' }}
            >
              <Typography fontWeight={600}>{D.importContacts}</Typography>
            </Button>
          )}
        </Stack>
      </CardContent>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        selectedContact={selectedContact}
        canDelete={canDeleteContact()}
        onClose={closeDeleteModal}
        onConfirm={deletedSelectedContact}
      />

      {nextCollectHistory?.persons[selectedContactIndex] && (
        <ContactModal
          open={modifyModalOpen}
          modalTitle={D.contactModalTitleEdit}
          contact={selectedContact}
          onClose={closeModifyModal}
          onConfirm={modifyContactInTable}
          isFirst={false}
        />
      )}

      <ContactModal
        modalTitle={D.modalAddContact}
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onConfirm={addNewContact}
        isFirst={nextContacts?.length === 0}
      />

      <PhoneNumberImportAlert
        open={phoneNumberModal}
        contactsToResolve={contactsImportState}
        onClose={closePhoneNumberModal}
      />
    </Card>
  );
}
