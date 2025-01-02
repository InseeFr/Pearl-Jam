import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import React from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import D from 'i18n';
import { isQuestionnaireAvailable } from '../../utils/functions';
import { useArticulationTable } from 'dramaQueen/useArticulationTable';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export function Questionnaires({ surveyUnit }) {
  const { id } = surveyUnit;
  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);

  return (
    <Card p={2} elevation={0}>
      <CardContent>
        <Stack gap={3}>
          {/* Title */}
          <Row justifyContent="space-between">
            <Row gap={1}>
              <StickyNote2Icon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.openQuestionnaire}
              </Typography>
            </Row>

            <Button
              variant="contained"
              disabled={!isAvailable}
              startIcon={<LibraryBooksIcon />}
              component={RouterLink}
              to={`/queen/survey-unit/${id}`}
            >
              {D.accessTheQuestionnaire}
            </Button>
          </Row>

          {/* Table */}
          <ArticulationTable id={id} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Articulation table for a given identifier.
 *
 * @param {{id: string}} props
 */
export function ArticulationTable(props) {
  const table = useArticulationTable(React, props.id);

  if (!table) {
    return null;
  }

  return (
    <Table style={{ borderCollapse: 'collapse' }}>
      <TableHead>
        <TableRow>
          {table.headers.map((header, k) => (
            <TableCell key={k}>{header}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row, k) => (
          <TableRow key={k}>
            {row.cells.map((cell, kk) => (
              <TableCell key={kk}>{cell.value}</TableCell>
            ))}
            <TableCell>
              <Button variant="contained" component={RouterLink} to={row.url}>
                {row.label}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
