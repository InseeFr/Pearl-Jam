import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
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
import { Box, Table, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import Chip from '@mui/material/Chip';
import React, {useEffect, useState} from 'react';
import { getMostRecentState } from '../../utils/synchronize';
import { getLang } from '../../i18n/build-dictionary';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const chipStyle = { background: '#FFF', boxShadow: 2 };

type ArticulationTableData = {
  rows: {
    cells: { value: number }[];
    progress: 0 | -1 | 1;
    label: string;
    url: string;
  }[];
};

type ArticulationTableHook = (
  react: unknown,
  id: string
) => ArticulationTableData;

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
  allArticulationRowsCompleted: boolean
): -1 | 1 | 2 | null {
  if (!isAvailable) {
    return null;
  }

  if (isQuestionnaireCompleted || allArticulationRowsCompleted) {
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
  isAvailable,
  isQuestionnaireInit,
  isQuestionnaireCompleted,
  allArticulationRowsCompleted,
}: Readonly<{
  isAvailable: boolean;
  isQuestionnaireInit: boolean;
  isQuestionnaireCompleted: boolean;
  allArticulationRowsCompleted: boolean;
}>) {
  const progress = getQuestionnaireProgress(
    isAvailable,
    isQuestionnaireInit,
    isQuestionnaireCompleted,
    allArticulationRowsCompleted
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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{D.questionnaireAccessConfirmationTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {D.questionnaireAccessConfirmationMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {D.cancelButton}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
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

  const [articulationHook, setArticulationHook] = useState<ArticulationTableHook | null>(null);
  const [articulationTable, setArticulationTable] = useState<ArticulationTableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    import('dramaQueen/useArticulationTable')
      .then(module => {
        setArticulationHook(() => module.default.useArticulationTable);
      })
      .catch(e => {
        console.error("loading error 'dramaQueen/useArticulationTable'", e);
      });
  }, []);

  useEffect(() => {
    if (articulationHook) {
      const table = articulationHook(React, id);
      setArticulationTable(table);
    }
  }, [articulationHook, id]);

  const isQuestionnaireInit = surveyUnit.otherModeQuestionnaireState?.some(
    state => state.state === 'QUESTIONNAIRE_INIT'
  );
  const isQuestionnaireCompleted = surveyUnit.otherModeQuestionnaireState?.some(
    state => state.state === 'QUESTIONNAIRE_COMPLETED' || state.state === 'QUESTIONNAIRE_VALIDATED'
  );

  const allArticulationRowsCompleted = areAllArticulationRowsCompleted(articulationTable);

  const latestState = getMostRecentState(surveyUnit);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate(`/queen/survey-unit/${id}`);
  };

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
                isAvailable={isAvailable}
                isQuestionnaireInit={isQuestionnaireInit ?? false}
                isQuestionnaireCompleted={isQuestionnaireCompleted ?? false}
                allArticulationRowsCompleted={allArticulationRowsCompleted}
              />

              <Button
                variant="contained"
                disabled={!isAvailable}
                startIcon={<SlowMotionVideoIcon />}
                onClick={handleOpenModal}
              >
                {D.accessTheQuestionnaire}
              </Button>
            </Row>

            <ConfirmationModal
              open={isModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirm}
            />

            {latestState?.date && (
              <Row gap={6}>
                <Stack bgcolor="surfacePrimary.main" minWidth={325} borderRadius={2}>
                  <Box m={2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarMonthIcon />
                    <Typography variant="s" color="text.secondary" sx={{ pl: 1 }}>
                      {new Intl.DateTimeFormat(getLang(), {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(new Date(latestState?.date))}
                    </Typography>
                  </Box>
                </Stack>
              </Row>
            )}
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
              {articulationTable && (
                <ArticulationTable table={articulationTable} />
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
  }>
) {
  const table = props.table;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<string>('');

  const handleOpenModal = (url: string) => {
    setSelectedUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUrl('');
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate(selectedUrl);
    setSelectedUrl('');
  };

  if (!table) {
    return null;
  }

  return (
    <>
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
                  onClick={() => handleOpenModal(row.url)}
                  startIcon={<SlowMotionVideoIcon />}
                >
                  {row.label}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
      />
    </>
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
