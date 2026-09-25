import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Row } from '../Row';
import { Typography } from '../Typography';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BlockIcon from '@mui/icons-material/Block';
import D from 'i18n';
import { SurveyUnit, SurveyUnitState } from 'types/pearl';
import { addNewState, isQuestionnaireAvailable, persistSurveyUnit } from '../../utils/functions';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import React, { useEffect, useState } from 'react';
import { getLatestWebState } from '../../utils/synchronize';
import { getLang } from '../../i18n/build-dictionary';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNetworkOnline } from '../../utils/hooks/useOnline';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import { useSurveyUnit } from 'utils/hooks/database';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';

const chipStyle = { background: '#FFF', boxShadow: 2 };

type ArticulationTableData = {
  rows: {
    cells: { value: number }[];
    progress: 0 | -1 | 1;
    label: string;
    url: string;
  }[];
};

/**
 * Checks if all articulation rows are completed (progress === 1)
 * @param table - The articulation table data
 * @returns true if all rows are completed, false otherwise
 */
function areAllArticulationRowsCompleted(table: ArticulationTableData | null): boolean {
  if (!table?.rows || table.rows.length === 0) {
    return false;
  }

  return table.rows.every(row => row.progress === 1);
}

/**
 * Determines the questionnaire progress state
 * @returns -1 (not started), 1 (completed), 2 (in progress), or null (not available)
 */
function getQuestionnaireProgress(
  isAvailable: boolean,
  isQuestionnaireInit: boolean,
  isQuestionnaireCompleted: boolean,
  allArticulationRowsCompleted: boolean,
  latestStateType: SurveyUnitState['type'] | undefined,
  regainedControlJustDone: boolean
): -1 | 1 | 2 | 3 | null {
  if (!isAvailable) {
    return null;
  }

  if (regainedControlJustDone) return 3;

  if (isQuestionnaireCompleted || (allArticulationRowsCompleted && latestStateType === 'WFT')) {
    return 1; // Completed
  }

  if (isQuestionnaireInit) {
    return 2; // In progress
  }

  return -1; // Not started
}

/**
 * Component to display the questionnaire state chip based on progress
 */
function QuestionnaireStateChip({
  surveyUnit,
  allArticulationRowsCompleted,
  regainedControlJustDone,
}: Readonly<{
  surveyUnit: SurveyUnit;
  allArticulationRowsCompleted: boolean;
  regainedControlJustDone: boolean;
}>) {
  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);
  const isQuestionnaireInit = surveyUnit.otherModeQuestionnaireState?.some(
    state => state.state === 'QUESTIONNAIRE_INIT'
  );
  const isQuestionnaireCompleted = surveyUnit.otherModeQuestionnaireState?.some(
    state => state.state === 'QUESTIONNAIRE_COMPLETED' || state.state === 'QUESTIONNAIRE_VALIDATED'
  );

  const latestState = surveyUnit.states.reduce<SurveyUnitState | undefined>(
    (latest, current) => (!latest || current.date > latest.date ? current : latest),
    undefined
  );

  const progress = getQuestionnaireProgress(
    isAvailable,
    isQuestionnaireInit ?? false,
    isQuestionnaireCompleted ?? false,
    allArticulationRowsCompleted,
    latestState?.type,
    regainedControlJustDone
  );

  if (progress === null) {
    return null;
  }

  return <StateChip progress={progress} />;
}

/**
 * Confirmation modal component
 */
function ConfirmationModal({
  open,
  onClose,
  onConfirm,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}>) {
  const online = useNetworkOnline();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{D.questionnaireAccessConfirmationTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {online ? D.questionnaireAccessConfirmationMessage : D.requireNetworkAction}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {D.cancelButton}
        </Button>
        <Button disabled={!online} onClick={onConfirm} color="primary" variant="contained">
          {D.continueButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function Questionnaires({ surveyUnit }: Readonly<{ surveyUnit: SurveyUnit }>) {
  const { id } = surveyUnit;

  const isAvailable = isQuestionnaireAvailable(surveyUnit)(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(window.location.search);

  const regainedControlJustDone = searchParams.get('feedback') === 'regainedControlDone';

  const [articulationTable, setArticulationTable] = useState<ArticulationTableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    import('dramaQueen/getArticulationTable')
      .then(module => module.default.getArticulationTable(id))
      .then(setArticulationTable);
  }, [id]);

  // The questionnaire was started on the web if it has at least one "web" event
  const isWebQuestionnaire = Boolean(
    surveyUnit.otherModeQuestionnaireState && surveyUnit.otherModeQuestionnaireState.length > 0
  );
  const isWebQuestionnaireCompleted = Boolean(
    surveyUnit.otherModeQuestionnaireState?.some(
      state =>
        state.state === 'QUESTIONNAIRE_COMPLETED' || state.state === 'QUESTIONNAIRE_VALIDATED'
    )
  );

  const hasControlBeenRegained = surveyUnit.states.some(
    state => state.type === surveyUnitStateEnum.REGAINED_CONTROL_INTERVIEW.type
  );

  const allArticulationRowsCompleted = areAllArticulationRowsCompleted(articulationTable);

  const latestWebState = getLatestWebState(surveyUnit);

  const regainControl = () => {
    setIsModalOpen(true);
  };

  const canRegainControl =
    isWebQuestionnaire && !isWebQuestionnaireCompleted && !hasControlBeenRegained;

  const openQuestionnaire = () => {
    navigate(`/queen/interrogations/${id}`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    setIsModalOpen(false);
    await surveyUnitIDBService.update({
      ...surveyUnit,
      priority: true,
    });
    const newStates = addNewState(surveyUnit, surveyUnitStateEnum.REGAINED_CONTROL_INTERVIEW.type);
    await persistSurveyUnit({ ...surveyUnit, states: newStates });
    navigate(`/queen/interrogations/synchronize/${id}`);
  };

  const canOpenArticulationQuestionnaires =
    // either it's not a web questionnaire
    !isWebQuestionnaire ||
    // either it's a web questionnaire, for which we have regained control
    (isWebQuestionnaire && hasControlBeenRegained);

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

              <QuestionnaireStateChip
                surveyUnit={surveyUnit}
                allArticulationRowsCompleted={allArticulationRowsCompleted}
                regainedControlJustDone={regainedControlJustDone}
              />

              {canRegainControl && (
                <Button
                  variant="contained"
                  startIcon={<SlowMotionVideoIcon />}
                  onClick={regainControl}
                >
                  {D.regainControlQuestionnaire}
                </Button>
              )}

              {!canRegainControl && (
                <Button
                  variant="contained"
                  disabled={!isAvailable || isWebQuestionnaireCompleted}
                  startIcon={<SlowMotionVideoIcon />}
                  onClick={openQuestionnaire}
                >
                  {D.accessTheQuestionnaire}
                </Button>
              )}
            </Row>

            <ConfirmationModal
              open={isModalOpen}
              onClose={handleCancel}
              onConfirm={handleConfirm}
            />

            {latestWebState?.date && (
              <Row gap={6}>
                <Stack bgcolor="surfacePrimary.main" minWidth={325} borderRadius={2}>
                  <Box m={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarMonthIcon />
                    <Typography variant="s" color="text.secondary" sx={{ pl: 1 }}>
                      {new Intl.DateTimeFormat(getLang(), {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(new Date(latestWebState?.date))}
                    </Typography>
                  </Box>
                </Stack>
              </Row>
            )}
          </Stack>
          {articulationTable && (
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
              {articulationTable && (
                <ArticulationTable
                  table={articulationTable}
                  canOpenUrls={canOpenArticulationQuestionnaires}
                />
              )}
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
export function ArticulationTable(
  props: Readonly<{
    table: ArticulationTableData | null;
    canOpenUrls: boolean;
  }>
) {
  const table = props.table;
  const canOpenUrls = props.canOpenUrls;
  const navigate = useNavigate();

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
            {canOpenUrls && (
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => navigate(row.url)}
                  startIcon={<SlowMotionVideoIcon />}
                >
                  {row.label}
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StateChip(props: Readonly<{ progress: number }>) {
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

  if (props.progress === 3) {
    return (
      <Chip
        label={D.justRegainedControl}
        icon={<SyncAltIcon />}
        size="small"
        color="success"
        sx={{ ...chipStyle, color: 'success.main' }}
      />
    );
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
