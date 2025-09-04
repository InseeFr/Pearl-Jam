import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import { Row } from '../Row';
import { Typography } from '../Typography';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BlockIcon from '@mui/icons-material/Block';
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { isQuestionnaireAvailable } from '../../utils/functions';
import { useArticulationTable } from 'dramaQueen/useArticulationTable';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import Chip from '@mui/material/Chip';
import React from 'react';

const chipStyle = { background: '#FFF', boxShadow: 2 };

export function Questionnaires({ surveyUnit }: Readonly<{ surveyUnit: SurveyUnit }>) {
  const { id } = surveyUnit;
  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);

  return (
    <Card elevation={0}>
      <CardContent>
        <Stack gap={6}>
          <Stack gap={3}>
            {/* Title */}
            <Row gap={4}>
              <Row gap={1}>
                <StickyNote2Icon fontSize="large" />
                <Typography component="h2" variant="xl" fontWeight={700}>
                  {D.openQuestionnaire}
                </Typography>
              </Row>

              {isAvailable && (
                <Chip
                  label={D.inProgress}
                  icon={<TrackChangesIcon />}
                  size="small"
                  color="warning"
                  sx={{ ...chipStyle, color: 'warning.main' }}
                />
              )}

              <Button
                variant="contained"
                disabled={!isAvailable}
                startIcon={<SlowMotionVideoIcon />}
                component={RouterLink}
                to={`/queen/survey-unit/${id}`}
              >
                {D.accessTheQuestionnaire}
              </Button>
            </Row>
          </Stack>
          {import.meta.env.VITE_ARTICULATION && (
            <Stack gap={3}>
              {/* Title */}
              <Row justifyContent="space-between">
                <Row gap={1}>
                  <GroupOutlinedIcon fontSize="large" />
                  <Typography component="h2" variant="xl" fontWeight={700}>
                    {D.personDetails}
                  </Typography>
                </Row>
              </Row>

              {/* Table */}
              <ArticulationTable id={id} />
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Articulation table for a given identifier.
 */
export function ArticulationTable(props: { id: string }) {
  const table = useArticulationTable(React, props.id);

  if (!table) {
    return null;
  }

  return (
    <Table sx={{ borderCollapse: 'collapse' }} size="small" style={{ width: 'max-content' }}>
      <TableBody>
        {table.rows.map((row, k) => (
          <TableRow key={k}>
            <TableCell width={50} style={{ background: 'none' }}>
              <PersonOutlineOutlinedIcon />
            </TableCell>
            {row.cells.map((cell, kk) => (
              <TableCell key={kk}>{cell.value}</TableCell>
            ))}
            <TableCell>
              <StateChip progress={row.progress} />
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                component={RouterLink}
                to={row.url}
                startIcon={<SlowMotionVideoIcon />}
              >
                {row.label}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StateChip(props: { progress: number }) {
  if (props.progress === 1) {
    return (
      <Chip
        label={D.finished}
        icon={<CheckCircleIcon />}
        color="success"
        size="small"
        sx={{ ...chipStyle, color: 'success.main' }}
      />
    );
  }
  if (props.progress === -1) {
    return <Chip size="small" label={D.notStarted} icon={<BlockIcon />} sx={{ ...chipStyle }} />;
  }
  return (
    <Chip
      label={D.inProgress}
      icon={<TrackChangesIcon />}
      size="small"
      color="warning"
      sx={{ ...chipStyle, color: 'warning.main' }}
    />
  );
}
