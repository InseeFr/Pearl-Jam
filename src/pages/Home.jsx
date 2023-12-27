import React, { useMemo } from 'react';
import { SidebarLayout } from '../ui/SidebarLayout';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Typography } from '../ui/Typography';
import D from '../i18n/build-dictionary';
import { Accordion } from '../ui/Accordion';
import { useMissingSurveyUnits, useSurveyUnits } from '../utils/hooks/database';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { filterSurveyUnits, useSearchFilter } from '../utils/hooks/useSearchFilter';
import { Hr } from '../ui/Hr';
import { toDoEnum } from '../utils/enum/SUToDoEnum';
import { StatusChip } from '../ui/StatusChip';
import Grid from '@mui/material/Grid';
import { SwitchIOS } from '../ui/Switch';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IconButton from '@mui/material/IconButton';
import { IconDesc } from '../ui/Icons/IconDesc';
import { IconAsc } from '../ui/Icons/IconAsc';
import { SearchField } from '../ui/SearchField';
import { SurveyCard } from '../ui/SurveyCard';
import { Row } from '../ui/Row';
import { Select } from '../ui/Select';

/**
 *
 */

export function Home() {
  const surveyUnits = useSurveyUnits();
  const missingSurveyUnitIds = useMissingSurveyUnits().map(surveyUnit => surveyUnit.id);
  const filter = useSearchFilter();

  const filteredSurveyUnits = filterSurveyUnits(surveyUnits, filter);

  return (
    <>
      <SidebarLayout>
        <Sidebar surveyUnits={surveyUnits} />
        <Stack sx={{ minHeight: 0 }}>
          <GridHeader visibleCount={filteredSurveyUnits.length} totalCount={surveyUnits.length} />
          <Grid
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              minHeight: 0,
              overflow: 'auto',
              // Offset the scrollbar out of the container
              width: 'calc(100% + .5rem)',
              paddingRight: '.5rem',
            }}
            gap={2}
          >
            {filteredSurveyUnits.map(su => (
              <div key={su.id}>
                <SurveyCard
                  key={su.id}
                  surveyUnit={su}
                  locked={missingSurveyUnitIds.includes(su.id)}
                />
              </div>
            ))}
          </Grid>
        </Stack>
      </SidebarLayout>
    </>
  );
}

function GridHeader({ visibleCount, totalCount }) {
  const {
    setSortField,
    sortField,
    sortDirection,
    toggleSortDirection,
    setSearch,
    search,
  } = useSearchFilter();
  return (
    <Stack gap={2} sx={{ flex: 'none' }}>
      <SearchField value={search} onChange={setSearch} />
      <Row justifyContent="space-between" mb={2.5}>
        <Typography size="m">
          {visibleCount} unités sur {totalCount}
        </Typography>
        <Row gap={1}>
          <Typography as="label" id="sort-field" sx={{ flex: 'none' }}>
            Trier par:
          </Typography>
          <Select
            sx={{ width: 200 }}
            labelId="sort-field"
            value={sortField}
            onChange={setSortField}
            options={[
              { label: D.remainingDays, value: 'remainingDays' },
              { label: D.priority, value: 'priority' },
              { label: D.survey, value: 'campaign' },
              { label: D.subSample, value: 'sampleIdentifiers' },
            ]}
          />
          <IconButton aria-label="delete" color="textPrimary" onClick={toggleSortDirection}>
            {sortDirection === 'ASC' ? <IconAsc /> : <IconDesc />}
          </IconButton>
        </Row>
      </Row>
    </Stack>
  );
}

function Sidebar({ surveyUnits }) {
  const campaigns = useMemo(() => [...new Set(surveyUnits.map(u => u.campaign))], [surveyUnits]);

  const filter = useSearchFilter();
  const states = useMemo(() => Object.entries(toDoEnum), []);
  const subSamples = useMemo(() => [...new Set(surveyUnits.map(u => u.sampleIdentifiers.ssech))], [
    surveyUnits,
  ]);

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        minHeight: 0,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
      elevation={0}
    >
      <Stack
        p={2}
        gap={2}
        alignItems="stretch"
        sx={{ height: '100%', overflowY: 'auto', minHeight: 0 }}
      >
        <Typography variant="m">Filtrer les unités par</Typography>
        <Accordion variant="dense" title={D.sortSurvey} defaultOpen>
          <Stack gap={0.5}>
            {campaigns.map(campaign => (
              <FormControlLabel
                key={campaign}
                control={
                  <Checkbox
                    checked={filter.campaigns.includes(campaign)}
                    onChange={() => filter.toggle('campaigns', campaign)}
                    sx={{ padding: 0 }}
                  />
                }
                label={campaign.toLowerCase()}
              />
            ))}
          </Stack>
        </Accordion>
        <Hr />
        <Accordion variant="dense" title={D.priority} defaultOpen>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.priority}
                onChange={() => filter.toggle('priority')}
                sx={{ padding: 0 }}
              />
            }
            label="Unités prioritaires"
          />
        </Accordion>
        <Hr />
        <Accordion variant="dense" title={D.sortStatus} defaultOpen>
          <Stack gap={2} alignItems="stretch" width="100%">
            <FormControlLabel
              sx={{ width: '100%', justifyContent: 'space-between' }}
              labelPlacement="start"
              control={
                <SwitchIOS
                  checked={filter.terminated}
                  onChange={() => filter.toggle('terminated')}
                />
              }
              label="Masquer les unités terminées"
            />

            <Stack gap={0.5}>
              {states.map(([statusKey, statusInfo]) => (
                <FormControlLabel
                  key={statusKey}
                  control={
                    <Checkbox
                      checked={filter.states.includes(statusInfo.order)}
                      onChange={() => filter.toggle('states', statusInfo.order)}
                      sx={{ padding: 0 }}
                    />
                  }
                  label={<StatusChip status={statusInfo} />}
                />
              ))}
            </Stack>
          </Stack>
        </Accordion>
        <Hr />
        <Accordion variant="dense" title="Sous-échantillon et grappe" defaultOpen>
          <Stack gap={2} sx={{ width: '100%' }}>
            <Select
              value={filter.subSample}
              allowEmpty
              placeholder="Sous-échantillon..."
              onChange={v => filter.setSubSample(v)}
              options={subSamples}
            />
            <Select value="" placeholder="Grappe..." allowEmpty />
          </Stack>
        </Accordion>
        <Hr />
        <div>
          <Button size="edge" color="textPrimary" variant="underlined" onClick={filter.reset}>
            <RestartAltIcon />
            Réinitialiser les filtres
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}
