import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import IconButton from '@mui/material/IconButton';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import TextField from '@mui/material/TextField';
import { Typography } from '../ui/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { useSurveyUnits } from '../utils/hooks/database';
import { CampaignProgress } from '../ui/Stats/CampaignProgress';
import React, { useMemo, useState, useEffect } from 'react';
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
  daysLeftForSurveyUnit,
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
import D from 'i18n';

export function SuiviPage() {
  const surveyUnits = useSurveyUnits();
  const [campaign, setCampaign] = useState(() => {
    return localStorage.getItem('selectedCampaign') || '';
  });
  const [searchText, setSearchText] = useState('');
  const campaigns = useMemo(
    () =>
      Array.from(new Set(surveyUnits.map(su => su.campaign))).map(c => ({
        label: c.toLowerCase(),
        value: c,
      })),
    [surveyUnits]
  );

  useEffect(() => {
    localStorage.setItem('selectedCampaign', campaign);
  }, [campaign]);

  const [tab, setTab] = useState('stats');
  const handleSearchTextChange = event => {
    setSearchText(event.target.value);
  };

  return (
    <Box m={2}>
      <Card elevation={2}>
        <CardContent>
          <Stack gap={4}>
            <Row justifyContent="space-between">
              <Row gap={2}>
                <Typography sx={{ flex: 'none' }} variant="headingM" color="black" as="h1">
                  {D.goToMyTracking}
                </Typography>
                {tab === 'table' && (
                  <>
                    {' | '}
                    <Select
                      onChange={setCampaign}
                      sx={{ minWidth: 210 }}
                      value={campaign}
                      placeholder={D.trackingSelect}
                      options={campaigns}
                    />
                    {campaign && (
                      <IconButton aria-label="reset" onClick={() => setCampaign('')}>
                        <RestartAltIcon />
                      </IconButton>
                    )}
                    <TextField
                      label={D.trackingName}
                      variant="outlined"
                      size="small"
                      value={searchText}
                      onChange={handleSearchTextChange}
                      sx={{ marginLeft: 0.5, marginRight: 2, width: '330px' }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchOutlinedIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </>
                )}
              </Row>
              <Tabs
                value={tab}
                onChange={(_, tab) => setTab(tab)}
                aria-label={D.trackingToggleAria}
                textColor="secondary"
              >
                <Tab label={D.allSurveys} value="stats" />
                <Tab label={D.unitsTrackingBySurvey} value="table" />
              </Tabs>
            </Row>
            {tab === 'stats' ? (
              <SuiviStats surveyUnits={surveyUnits} />
            ) : (
              <SuiviTable surveyUnits={surveyUnits} campaign={campaign} searchText={searchText} />
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
  const [sortDirection, setSortDirection] = useState('');
  const handleSortChange = direction => {
    setSortDirection(direction);
  };

  const surveyUnitsPerCampaign = useMemo(
    () => groupBy(surveyUnits, su => su.campaign),
    [surveyUnits]
  );

  const sortedCampaignLabels = useMemo(() => {
    if (sortDirection.startsWith('deadline')) {
      const labelsWithDeadline = Object.entries(surveyUnitsPerCampaign).map(([label, units]) => ({
        label,
        deadline: daysLeftForSurveyUnit(units),
      }));

      const sortedByDeadline = labelsWithDeadline.sort((a, b) => {
        if (sortDirection === 'deadlineAsc') {
          return a.deadline - b.deadline;
        } else {
          return b.deadline - a.deadline;
        }
      });

      return sortedByDeadline.map(item => item.label);
    } else {
      const labels = Object.keys(surveyUnitsPerCampaign);
      return labels.sort((a, b) => {
        if (sortDirection === 'desc') {
          return b.localeCompare(a);
        } else {
          // 'asc'
          return a.localeCompare(b);
        }
      });
    }
  }, [surveyUnitsPerCampaign, sortDirection]);

  const sortOptions = [
    { value: 'asc', label: `${D.campaignNameAsc}` },
    { value: 'desc', label: `${D.campaignNameDesc}` },
    { value: 'deadlineAsc', label: `${D.shortDeadline}` },
    { value: 'deadlineDesc', label: `${D.longDeadline}` },
  ];

  return (
    <Box m={2}>
      <Card elevation={2}>
        <CardContent>
          <Stack gap={4}>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="body1" sx={{ flexGrow: 0, marginRight: 2 }}>
                {D.trackingAccessDetailedData}
              </Typography>
              <Select
                options={sortOptions}
                value={sortDirection}
                onChange={handleSortChange}
                placeholder={D.noSorting}
                allowEmpty
                sx={{ width: '210px' }}
              />
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <ScrollableBox height="646px">
                  <Grid container spacing={2}>
                    {sortedCampaignLabels.map(label => (
                      <Grid item xs={12} sm={6} key={label}>
                        <CampaignProgress
                          label={label}
                          surveyUnits={surveyUnitsPerCampaign[label]}
                        />
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
        </CardContent>
      </Card>
    </Box>
  );
}

/**
 * Table showing every unit for a specific campaign
 *
 * @param {string} campaign
 * @param {SurveyUnit[]} surveyUnits
 */
function SuiviTable({ surveyUnits, campaign, searchText }) {
  const [sortConfig, setSortConfig] = useState({ key: 'unit', direction: 'asc' });
  const toggleSort = key => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };
  const maxHeight = 'calc(100vh - 230px)';
  const compareValues = (a, b, isAscending) => {
    if (a < b) return isAscending ? -1 : 1;
    if (a > b) return isAscending ? 1 : -1;
    return 0;
  };

  const getLastName = su => getprivilegedPerson(su).lastName.toUpperCase();
  const getOrder = su => parseInt(getSuTodoState(su).order, 10);
  const contactOutcomeOrder = [
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
  const getOutcomeIndex = su => {
    const index = contactOutcomeOrder.indexOf(su.contactOutcome?.type);
    return index === -1 ? Infinity : index;
  };

  const filteredSurveyUnits = surveyUnits
    .filter(su => {
      const person = getprivilegedPerson(su);
      const filteredByCampaign = campaign === '' || su.campaign === campaign;
      return (
        filteredByCampaign &&
        (searchText === '' ||
          person.lastName.toUpperCase().includes(searchText.toUpperCase()) ||
          person.firstName.toUpperCase().includes(searchText.toUpperCase()))
      );
    })
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
          compareA = getOutcomeIndex(a);
          compareB = getOutcomeIndex(b);
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {D.trackingUnit}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {D.trackingName}
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {D.trackingSurveyUnitStatus}
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

            <TableCell>{D.trackingLastContactAttempt}</TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {D.contactOutcome}
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
            <TableCell>{D.goToCommentsPage}</TableCell>
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
            <Link to={`/survey-unit/${surveyUnit.id}/details`}>#{surveyUnit.id}</Link>
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
