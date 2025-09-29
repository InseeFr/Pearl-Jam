import D from 'i18n';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { PreviousContactHistoryPerson } from 'types/pearl';
import { CustomTableCell } from './CustomTableCell';
import { getAge } from 'utils/functions';

type ContactsTableProps = {
  contacts: readonly PreviousContactHistoryPerson[];
};

export function PreviousContactsTable({ contacts }: Readonly<ContactsTableProps>) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -4 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {[
                D.contactCivilityLabel,
                D.collectTableFirstName,
                D.collectTableAge,
                D.preivousCollectTablePanel,
              ].map(label => (
                <TableCell key={label} style={{ backgroundColor: 'white' }}>
                  <Typography fontWeight={600} color={'grey'}>
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(c => (
              <TableRow key={`${c.title} + ${c.firstName} ${c.birthdate}`}>
                <CustomTableCell>{c.title}</CustomTableCell>
                <CustomTableCell>{c.firstName}</CustomTableCell>
                <CustomTableCell>{getAge(c.birthdate)}</CustomTableCell>
                <CustomTableCell>{c.panel ? D.yes : D.no}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
