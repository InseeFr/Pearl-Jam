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

type ContactsTableProps = {
  contacts: readonly Contact[];
};

export function ContactsTable({ contacts }: ContactsTableProps) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -4 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {['Civilité', 'Prénom', 'Âge', 'Individu panel'].map(label => (
                <TableCell align="right" key={label} style={{ backgroundColor: 'white' }}>
                  <Typography fontWeight={600} color={'grey'}>
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c, i) => (
              <TableRow key={i} hover={true}>
                <TableCell>
                  <Typography fontWeight={600}>{c.civilite}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{c.firstName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{c.age}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{c.isPanel ? `${D.yes}` : `${D.no}`}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
