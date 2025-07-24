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
import { NextCollectHistory } from 'types/pearl';
import { CustomTableCell } from './CustomTableCell';

type HouseholdTableProps = {
  nextCollectHistory: NextCollectHistory;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
  onAdd?: () => void;
};

export function NextContactsTable({
  nextCollectHistory,
  onEdit,
  onDelete,
  onAdd,
}: HouseholdTableProps) {
  return (
    <Card elevation={0}>
      <CardContent sx={{ ml: -2 }}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {[
                'Civilité',
                'Nom',
                'Prénom',
                'Téléphone',
                'Adresse mail',
                'Contact courrier',
                '',
                '',
              ].map(label => (
                <TableCell key={label} style={{ backgroundColor: 'white' }}>
                  <Typography fontWeight={600} color="grey.700">
                    {label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {nextCollectHistory.houseHoldComposition.map((c, i) => (
              <TableRow key={i} hover>
                <CustomTableCell>{c.civilite}</CustomTableCell>
                <CustomTableCell>{c.lastName?.toUpperCase()}</CustomTableCell>
                <CustomTableCell>{c.firstName}</CustomTableCell>
                <CustomTableCell>{c.phoneNumber}</CustomTableCell>
                <CustomTableCell>
                  {c.isMailContact ? c.lastName?.toLowerCase() + '@example.com' : ''}
                </CustomTableCell>
                <TableCell style={{ backgroundColor: 'white', textAlign: 'center' }}>
                  {c.isMailContact && (
                    <CheckCircle fontSize="medium" sx={{ color: 'success.main' }} />
                  )}
                </TableCell>
                <Button onClick={() => onEdit?.(i)} size="small" variant="contained">
                  <Edit fontSize="small" />
                  <Typography fontWeight={600}> Modifier</Typography>
                </Button>
                <Button
                  onClick={() => onDelete?.(i)}
                  size="small"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  <Delete fontSize="small" />
                  <Typography fontWeight={600}>Supprimer</Typography>
                </Button>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Stack direction="row" mt={3}>
          <Button
            onClick={onAdd}
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: 'primary.dark',
              textTransform: 'none',
            }}
          >
            <Typography fontWeight={600}>Ajouter un individu</Typography>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
