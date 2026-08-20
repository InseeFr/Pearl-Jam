import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  TableBody,
} from '@mui/material';
import { useState } from 'react';
import { IconAsc } from 'ui/Icons/IconAsc';
import { IconDesc } from 'ui/Icons/IconDesc';

import { getprivilegedPerson, getSuTodoState } from 'utils/functions';
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { getLastSubmittedCommunication } from 'utils/functions/communicationFunctions';
import { SurveyUnitRow } from './SurveyUnitRow';

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
  const compareValues = (a: number | string, b: number | string, isAscending: boolean) => {
    if (a < b) return isAscending ? -1 : 1;
    if (a > b) return isAscending ? 1 : -1;
    return 0;
  };

  const getLastName = (su: SurveyUnit) => getprivilegedPerson(su).lastName.toUpperCase();
  const getOrder = (su: SurveyUnit) => Number.parseInt(getSuTodoState(su)?.order ?? '0', 10);
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

  /**
   * Custom comparison function for mail column sorting.
   * Sorts by type first (ascending/descending), then by date (newest first).
   */
  const compareMail = (a: SurveyUnit, b: SurveyUnit, isAscending: boolean): number => {
    const mailA = getLastSubmittedCommunication(a);
    const mailB = getLastSubmittedCommunication(b);

    if (!mailA && !mailB) return 0;
    if (!mailA) return 1;
    if (!mailB) return -1;

    const typeA = mailA.type ?? '';
    const typeB = mailB.type ?? '';
    const typeCompare = typeA.localeCompare(typeB);
    if (typeCompare !== 0) {
      return isAscending ? typeCompare : -typeCompare;
    }

    const dateA = mailA.date ?? 0;
    const dateB = mailB.date ?? 0;
    if (dateA !== dateB) {
      return isAscending ? dateB - dateA : dateA - dateB;
    }

    return 0;
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
        case 'mail':
          return compareMail(a, b, isAscending);
        default:
          compareA = a.id;
          compareB = b.id;
      }
      return compareValues(compareA, compareB, isAscending);
    });

  const defaultSortIcon = <IconAsc />;
  const sortAsc = sortConfig.direction === 'asc' ? <IconAsc /> : <IconDesc />;

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
                  {sortConfig.key === 'unit' ? sortAsc : defaultSortIcon}
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
                  {sortConfig.key === 'lastName' ? sortAsc : <IconAsc />}
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
                  {sortConfig.key === 'order' ? sortAsc : <IconAsc />}
                </Box>
              </Box>
            </TableCell>

            <TableCell>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="span" sx={{ flexGrow: 1 }}>
                  {D.trackingLastMailSent}
                </Box>
                <Box component="span" onClick={() => toggleSort('mail')} sx={{ cursor: 'pointer' }}>
                  {sortConfig.key === 'mail' ? sortAsc : <IconAsc />}
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
                  {sortConfig.key === 'outcome' ? sortAsc : <IconAsc />}
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
