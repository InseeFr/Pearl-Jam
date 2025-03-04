import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  TableBody,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconAsc } from 'ui/Icons/IconAsc';
import { IconDesc } from 'ui/Icons/IconDesc';
import { PaperIconButton } from 'ui/PaperIconButton';
import { StatusChip } from 'ui/StatusChip';
import { CommentDialog } from 'ui/SurveyUnit/CommentDialog';
import {
  getprivilegedPerson,
  getSuTodoState,
  isSelectable,
  getSortedContactAttempts,
  getCommentByType,
} from 'utils/functions';
import { formatDate } from 'utils/functions/date';
import { useToggle } from 'utils/hooks/useToggle';
import D from 'i18n';
import AddIcon from '@mui/icons-material/Add';
import { SurveyUnit } from 'types/pearl';
import {
  findContactAttemptLabelByValue,
  findMediumLabelByValue,
} from 'utils/functions/contacts/ContactAttempt';
import { findContactOutcomeLabelByValue } from 'utils/functions/contacts/ContactOutcome';

interface TableTrackingProps {
  campaign: string;
  surveyUnits: SurveyUnit[];
  searchText: string;
}

/**
 * Table showing every unit for a specific campaign
 *
 * @param {string} campaign
 * @param {SurveyUnit[]} surveyUnits
 */
export function TableTracking({ surveyUnits, campaign, searchText }: Readonly<TableTrackingProps>) {
  const [sortConfig, setSortConfig] = useState({ key: 'unit', direction: 'asc' });
  const toggleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };
  const maxHeight = 'calc(100vh - 230px)';
  const compareValues = (a: number, b: number, isAscending: boolean) => {
    if (a < b) return isAscending ? -1 : 1;
    if (a > b) return isAscending ? 1 : -1;
    return 0;
  };

  const getLastName = (su: SurveyUnit) => getprivilegedPerson(su).lastName.toUpperCase();
  const getOrder = (su: SurveyUnit) => parseInt(getSuTodoState(su).order, 10);
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
  const getOutcomeIndex = (su: SurveyUnit) => {
    if (su.contactOutcome?.type) {
      const index = contactOutcomeOrder.indexOf(su.contactOutcome.type);
      return index === -1 ? Infinity : index;
    }

    return Infinity;
  };

  const filteredSurveyUnits = surveyUnits
    .filter(su => {
      const person = getprivilegedPerson(su);
      const filteredByCampaign = campaign === '' || su.campaign === campaign;
      return (
        filteredByCampaign &&
        (searchText === '' ||
          person.lastName.toUpperCase().includes(searchText.toUpperCase()) ||
          person.firstName.toUpperCase().includes(searchText.toUpperCase()) ||
          su?.displayName?.toUpperCase().includes(searchText.toUpperCase()) ||
          su.id.toUpperCase().includes(searchText.toUpperCase()))
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

  const defaultSortIcon = <IconAsc />;

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
                    <IconAsc />
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
                    <IconAsc />
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
                    <IconAsc />
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

interface SurveyUnitRowProps {
  surveyUnit: SurveyUnit;
}

function SurveyUnitRow({ surveyUnit }: Readonly<SurveyUnitRowProps>) {
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
            <Link to={`/survey-unit/${surveyUnit.id}/details`}>
              #{surveyUnit.displayName ?? surveyUnit.id}
            </Link>
          ) : (
            `#${surveyUnit.displayName ?? surveyUnit.id}`
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
              <Typography component="span" variant="s" color="textPrimary">
                {findContactAttemptLabelByValue(lastContact.status)}
                <br />
                {findMediumLabelByValue(lastContact.medium)}
              </Typography>
              {' | '}
              <Typography component="span" variant="s" color="textTertiary">
                {formatDate(lastContact.date)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          {surveyUnit.contactOutcome && (
            <>
              <Typography component="span" variant="s" color="textPrimary">
                {findContactOutcomeLabelByValue(surveyUnit.contactOutcome.type)}
              </Typography>
              <br />
              <Typography component="span" variant="s" color="textTertiary">
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
              component="span"
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
