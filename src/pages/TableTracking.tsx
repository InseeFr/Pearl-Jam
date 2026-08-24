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
import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { SurveyUnitRow } from './SurveyUnitRow';
import { sortSurveyUnitsTrackingTable } from 'utils/functions/surveyunit-tracking/surveyUnitTrackingSorting';

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

  const filteredSurveyUnits = sortSurveyUnitsTrackingTable(
    surveyUnits,
    campaign,
    searchText,
    sortConfig
  );

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
