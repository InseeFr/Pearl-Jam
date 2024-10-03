import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useEffect, useMemo, useState } from 'react';
import D from '../i18n/build-dictionary';
import { Accordion } from '../ui/Accordion';
import { Hr } from '../ui/Hr';
import { IconAsc } from '../ui/Icons/IconAsc';
import { IconDesc } from '../ui/Icons/IconDesc';
import { Row } from '../ui/Row';
import { SearchField } from '../ui/SearchField';
import { Select } from '../ui/Select';
import { SidebarLayout } from '../ui/SidebarLayout';
import { StatusChip } from '../ui/StatusChip';
import { SurveyCard } from '../ui/SurveyCard';
import { SwitchIOS } from '../ui/Switch';
import { Typography } from '../ui/Typography';
import { toDoEnum } from '../utils/enum/SUToDoEnum';
import { persistSurveyUnit, updateStateWithDates } from '../utils/functions';
import { seedData } from '../utils/functions/seeder';
import { useMissingSurveyUnits, useSurveyUnits } from '../utils/hooks/database';
import { filterSurveyUnits, useSearchFilter } from '../utils/hooks/useSearchFilter';

export function Home() {
  const surveyUnits = useSurveyUnits();
  const missingSurveyUnitIds = useMissingSurveyUnits().map(surveyUnit => surveyUnit.id);
  const filter = useSearchFilter();
  const [shouldCheckState, setShouldCheckState] = useState(true);

  useEffect(() => {
    if (shouldCheckState && surveyUnits.length > 0) {
      // persist state VIC when identificationStartDate is reached
      setShouldCheckState(false);
      surveyUnits.forEach(su => {
        const newStates = updateStateWithDates(su);
        persistSurveyUnit({ ...su, states: newStates });
      });
    }
  }, [surveyUnits.length]);

  const filteredSurveyUnits = filterSurveyUnits(surveyUnits, filter);
  const isDev = filteredSurveyUnits.length === 0 && window.location.hostname === 'localhost';

  return (
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
          {isDev && (
            <Stack gap={2} py={5} alignItems="center" w={1} sx={{ gridColumn: '1 / -1' }}>
              <Typography variant="m" color="textTertiary" as="p">
                Vous êtes en mode développement
              </Typography>
              <Button variant="contained" onClick={seedData}>
                Importer des données de test
              </Button>
            </Stack>
          )}
        </Grid>
      </Stack>
    </SidebarLayout>
  );
}

function GridHeader({ visibleCount, totalCount }) {
  const { setSortField, sortField, sortDirection, toggleSortDirection, setSearch, search } =
    useSearchFilter();
  return (
    <Stack gap={2} sx={{ flex: 'none' }}>
      <SearchField value={search} onChange={setSearch} />
      <Row justifyContent="space-between" mb={2.5}>
        <Typography size="m">
          {visibleCount} {D.surveyUnits} {totalCount}
        </Typography>
        <Row gap={1}>
          <Typography as="label" id="sort-field" sx={{ flex: 'none' }}>
            {`${D.sortBy} :`}
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
  const subSamples = useMemo(
    () => [
      ...new Set(
        surveyUnits.map(u => u.sampleIdentifiers.ssech).filter(val => val !== null && val > -1)
      ),
    ],
    [surveyUnits]
  );
  const subGrappe = useMemo(
    () => [
      ...new Set(
        surveyUnits.map(u => u.sampleIdentifiers.nograp).filter(val => val !== null && val !== '')
      ),
    ],
    [surveyUnits]
  );

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
              label={D.HideFinishedUnits}
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
        <Accordion variant="dense" title={D.priority} defaultOpen>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.priority}
                onChange={() => filter.toggle('priority')}
                sx={{ padding: 0 }}
              />
            }
            label={D.PriorityUnits}
          />
        </Accordion>
        <Hr />
        <Typography variant="m">{D.filterUnitsBy}</Typography>
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
        <Accordion variant="dense" title={D.subSampleCluster} defaultOpen>
          <Stack gap={2} sx={{ width: '100%' }}>
            <Select
              value={filter.subSample}
              allowEmpty
              placeholder={D.subSample}
              onChange={v => filter.setSubSample(v)}
              options={subSamples}
            />
            <Select
              value={filter.subGrappe}
              allowEmpty
              placeholder={D.cluster}
              onChange={v => filter.setSubGrappe(v)}
              options={subGrappe}
            />
          </Stack>
        </Accordion>
        <Hr />
        <div>
          <Button size="edge" color="textPrimary" variant="underlined" onClick={filter.reset}>
            <RestartAltIcon />
            {D.resetFilters}
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}
