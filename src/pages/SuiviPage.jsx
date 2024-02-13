import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../ui/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useSurveyUnits } from '../utils/hooks/database';
import { CampaignProgress } from '../ui/Stats/CampaignProgress';
import React, { useMemo, useState } from 'react';
import { groupBy } from '../utils/functions/array';
import { CampaignProgressPieChart } from '../ui/Stats/CampaignProgressPieChart';
import { ScrollableBox } from '../ui/ScrollableBox';
import { Row } from '../ui/Row';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import {
  getCommentByType,
  getprivilegedPerson,
  getSortedContactAttempts,
  getSuTodoState,
  isSelectable,
} from '../utils/functions';
import { StatusChip } from '../ui/StatusChip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from '../ui/Link';
import { findContactOutcomeValueByType } from '../utils/enum/ContactOutcomeEnum';
import { formatDate } from '../utils/functions/date';
import { findMediumValueByType } from '../utils/enum/MediumEnum';
import { findContactAttemptValueByType } from '../utils/enum/ContactAttemptEnum';
import { Select } from '../ui/Select';
import { CommentDialog } from '../ui/SurveyUnit/CommentDialog';
import { useToggle } from '../utils/hooks/useToggle';
import { PaperIconButton } from '../ui/PaperIconButton';
import { IconDesc } from '../ui/Icons/IconDesc';
import { IconAsc } from '../ui/Icons/IconAsc';

export function SuiviPage() {
  const surveyUnits = useSurveyUnits();
  const [campaign, setCampaign] = useState('');
  const campaigns = useMemo(
    () =>
      Array.from(new Set(surveyUnits.map(su => su.campaign))).map(c => ({
        label: c.toLowerCase(),
        value: c,
      })),
    [surveyUnits]
  );
  const [tab, setTab] = useState('stats');
  return (
    <Box m={2}>
      <Card elevation={2}>
        <CardContent>
          <Stack gap={4}>
            {/* Header */}
            <Row justifyContent="space-between">
              <Row gap={2}>
                <Typography sx={{ flex: 'none' }} variant="headingM" color="black" as="h1">
                  Mon suivi
                </Typography>
                {tab === 'table' && (
                  <>
                    {' | '}
                    <Select
                      onChange={setCampaign}
                      sx={{ minWidth: 210 }}
                      value={campaign}
                      placeholder="Sélectionnez..."
                      options={campaigns}
                    />
                  </>
                )}
              </Row>

              <Tabs
                value={tab}
                onChange={(_, tab) => setTab(tab)}
                aria-label="Type de notification"
                textColor="secondary"
              >
                <Tab label="Toutes les enquêtes" value="stats" />
                <Tab label="Suivi des unités par enquête" value="table" />
              </Tabs>
            </Row>

            {tab === 'stats' ? (
              <SuiviStats surveyUnits={surveyUnits} />
            ) : (
              <SuiviTable surveyUnits={surveyUnits} campaign={campaign} />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

/**
 * @param {SurveyUnit[]} surveyUnits
 */
function SuiviStats({ surveyUnits }) {
  const surveyUnitsPerCampaign = useMemo(
    () => groupBy(surveyUnits, su => su.campaign),
    [surveyUnits]
  );
  return (
    <Stack gap={2}>
      <Typography variant="s" color="textTertiary" as="p">
        Pour accéder au détail, cliquez directement sur l’enquête souhaitée.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ScrollableBox height="calc(100vh - 32px - 160px - 84px)">
            <Grid container spacing={2}>
              {Object.entries(surveyUnitsPerCampaign).map(([name, units]) => (
                <Grid item xs={6} key={name}>
                  <CampaignProgress label={name} surveyUnits={units} />
                </Grid>
              ))}
            </Grid>
          </ScrollableBox>
        </Grid>
        <Grid item xs={6}>
          <CampaignProgressPieChart surveyUnits={surveyUnits} />
        </Grid>
      </Grid>
    </Stack>
  );
}

/**
 * Table showing every unit for a specific campaign
 *
 * @param {string} campaign
 * @param {SurveyUnit[]} surveyUnits
 */
function SuiviTable({ surveyUnits, campaign }) {
  const [sortConfig, setSortConfig] = useState({ key: 'unit', direction: 'asc' });
  const toggleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const maxHeight = 'calc(100vh - 230px)';
  if (!campaign) {
    return (
      <Row
        borderRadius={4}
        justifyContent="center"
        bgcolor="surfacePrimary.main"
        sx={{ height: maxHeight }}
      >
        <Typography variant="m" color="textHint">
          Sélectionnez une enquête dans la liste déroulante ci-dessus.
        </Typography>
      </Row>
    );
  }
  const compareValues = (a, b, isAscending) => {
    if (a < b) return isAscending ? -1 : 1;
    if (a > b) return isAscending ? 1 : -1;
    return 0;
  };

  const getLastName = su => getprivilegedPerson(su).lastName.toUpperCase();
  const getOrder = su => parseInt(getSuTodoState(su).order, 10);
  const getOutcomeIndex = (su, order) => {
    const index = order.indexOf(su.contactOutcome?.type);
    return index === -1 ? Infinity : index;
  };

  const filteredSurveyUnits = surveyUnits
    .filter(su => su.campaign === campaign)
    .sort((a, b) => {
      const isAscending = sortConfig.direction === 'asc';
      let compareA, compareB;
      switch (sortConfig.key) {
        case 'lastName':
          compareA = getLastName(a);
          compareB = getLastName(b);
          break;
        case 'order':
          compareA = getOrder(a);
          compareB = getOrder(b);
          break;
        case 'outcome':
          const order = [
            'INA',
            'REF',
            'IMP',
            'UCD',
            'UTR',
            'DCD',
            'ALA',
            'UCD',
            'DUK',
            'DUU',
            'NUH',
            'NOA',
          ];
          compareA = getOutcomeIndex(a, order);
          compareB = getOutcomeIndex(b, order);
          if (!isAscending) {
            compareA = compareA === Infinity ? -Infinity : compareA;
            compareB = compareB === Infinity ? -Infinity : compareB;
          }
          break;
        default:
          compareA = a.id;
          compareB = b.id;
      }

      return compareValues(compareA, compareB, isAscending);
    });
  const defaultSortIcon = <IconAsc sx={{ opacity: 0.3 }} />;

  return (
    <TableContainer sx={{ maxHeight: maxHeight }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box component="span" sx={{ flexGrow: 1 }}>
                  Unité
                </Box>
                <Box component="span" onClick={() => toggleSort('unit')} sx={{ cursor: 'pointer' }}>
                  {sortConfig.key === 'unit' ? (
                    sortConfig.direction === 'asc' ? (
                      <IconAsc />
                    ) : (
                      <IconDesc />
                    )
                  ) : (
                    defaultSortIcon
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box component="span" sx={{ flexGrow: 1 }}>
                  Nom/Prénom
                </Box>
                <Box
                  component="span"
                  onClick={() => toggleSort('lastName')}
                  sx={{ cursor: 'pointer' }}
                >
                  {sortConfig.key === 'lastName' ? (
                    sortConfig.direction === 'asc' ? (
                      <IconAsc />
                    ) : (
                      <IconDesc />
                    )
                  ) : (
                    <IconAsc sx={{ opacity: 0.3 }} />
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box component="span" sx={{ flexGrow: 1 }}>
                  Status de l'unité
                </Box>
                <Box
                  component="span"
                  onClick={() => toggleSort('order')}
                  sx={{ cursor: 'pointer' }}
                >
                  {sortConfig.key === 'order' ? (
                    sortConfig.direction === 'asc' ? (
                      <IconAsc />
                    ) : (
                      <IconDesc />
                    )
                  ) : (
                    <IconAsc sx={{ opacity: 0.3 }} />
                  )}
                </Box>
              </Box>
            </TableCell>

            <TableCell>Dernier essai de contact</TableCell>
            <TableCell>
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box component="span" sx={{ flexGrow: 1 }}>
                  Bilan de contact
                </Box>
                <Box
                  component="span"
                  onClick={() => toggleSort('outcome')}
                  sx={{ cursor: 'pointer' }}
                >
                  {sortConfig.key === 'outcome' ? (
                    sortConfig.direction === 'asc' ? (
                      <IconAsc />
                    ) : (
                      <IconDesc />
                    )
                  ) : (
                    <IconAsc sx={{ opacity: 0.3 }} />
                  )}
                </Box>
              </Box>
            </TableCell>
            <TableCell>Commentaire</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSurveyUnits.map(su => (
            <SurveyUnitRow surveyUnit={su} key={su.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/**
 * @param {SurveyUnit} surveyUnit
 */
function SurveyUnitRow({ surveyUnit }) {
  const person = getprivilegedPerson(surveyUnit);
  const state = getSuTodoState(surveyUnit);
  const isActive = isSelectable(surveyUnit);
  const lastContact = getSortedContactAttempts(surveyUnit)[0];
  const [showModal, toggleModal] = useToggle(false);
  const comment = getCommentByType('INTERVIEWER', surveyUnit);
  return (
    <>
      <TableRow>
        <TableCell align="center">
          {isActive ? (
            <Link to={`/survey-unit/${surveyUnit.id}/details?panel=0`}>#{surveyUnit.id}</Link>
          ) : (
            `#${surveyUnit.id}`
          )}
        </TableCell>
        <TableCell align="center">
          {person.lastName.toUpperCase()} {person.firstName}
        </TableCell>
        <TableCell align="center">
          <StatusChip status={state} />
        </TableCell>
        <TableCell align="center">
          {lastContact && (
            <>
              <Typography as="span" variant="s" color="textPrimary">
                {findContactAttemptValueByType(lastContact.status)}
                <br />
                {findMediumValueByType(lastContact.medium)}
              </Typography>
              {' | '}
              <Typography as="span" variant="s" color="textTertiary">
                {formatDate(lastContact.date)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          {surveyUnit.contactOutcome && (
            <>
              <Typography as="span" variant="s" color="textPrimary">
                {findContactOutcomeValueByType(surveyUnit.contactOutcome.type)}
              </Typography>
              <br />
              <Typography as="span" variant="s" color="textTertiary">
                {formatDate(surveyUnit.contactOutcome.date)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          {comment ? (
            <Typography
              textAlign="center"
              onClick={toggleModal}
              role="button"
              as="span"
              sx={{ maxWidth: '10em', display: 'inline-block', cursor: 'pointer' }}
              noWrap
              variant="s"
              color="inherit"
            >
              {comment}
            </Typography>
          ) : (
            <PaperIconButton onClick={toggleModal}>
              <AddIcon fontSize="small" color="textPrimary" />
            </PaperIconButton>
          )}
        </TableCell>
      </TableRow>
      <CommentDialog surveyUnit={surveyUnit} open={showModal} onClose={toggleModal} />
    </>
  );
}
