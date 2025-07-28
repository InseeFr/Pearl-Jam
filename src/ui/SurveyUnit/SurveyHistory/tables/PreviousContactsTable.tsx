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
import { Contact } from 'types/pearl';
import { CustomTableCell } from './CustomTableCell';

type ContactsTableProps = {
  contacts: readonly Contact[];
};

export function PreviousContactsTable({ contacts }: ContactsTableProps) {
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
            {contacts.map((c, i) => (
              <TableRow key={i}>
                <CustomTableCell>{c.civility}</CustomTableCell>
                <CustomTableCell>{c.firstName}</CustomTableCell>
                <CustomTableCell>{c.age}</CustomTableCell>
                <CustomTableCell>{c.isPanel ? D.yes : D.no}</CustomTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
