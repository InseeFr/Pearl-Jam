import UESPage from '../components/panel-body/UESpage';
import React, { useMemo } from 'react';
import { SidebarLayout } from '../ui/SidebarLayout';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Typography } from '../ui/Typography';
import D from '../i18n/build-dictionary';
import { Accordion } from '../ui/Accordion';
import { useSurveyUnits } from '../utils/hooks/database';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import { useSearchFilter } from '../utils/hooks/useSearchFilter';
import { Hr } from '../ui/Hr';
import { toDoEnum } from '../utils/enum/SUToDoEnum';
import { StatusChip } from '../ui/StatusChip';

export function Home() {
  const surveyUnits = useSurveyUnits();
  return (
    <>
      <SidebarLayout>
        <Sidebar surveyUnits={surveyUnits} />
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores commodi deleniti ea
          id illo laboriosam maiores minus molestiae natus necessitatibus, officiis optio quas qui
          quia quis sint tempora! Ex, magnam.
        </div>
      </SidebarLayout>
      <UESPage textSearch="" setTextSearch={console.log} />
    </>
  );
}

function Sidebar({ surveyUnits }) {
  const campaigns = useMemo(() => [...new Set(surveyUnits.map(unit => unit.campaign))], [
    surveyUnits,
  ]);

  const filter = useSearchFilter();
  const statuses = useMemo(() => Object.entries(toDoEnum), []);

  return (
    <Stack p={2} as={Paper} gap={2} alignItems="stretch">
      <Typography variant="m">Filtrer les unités par</Typography>
      <Accordion title={D.sortSurvey}>
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

      <Accordion title={D.priority}>
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

      <Accordion title={D.sortStatus}>
        <Stack gap={2} alignItems="stretch" width="100%">
          <FormControlLabel
            sx={{ width: '100%', justifyContent: 'space-between' }}
            labelPlacement="start"
            control={
              <Switch
                color="success"
                defaultChecked
                checked={filter.terminated}
                onChange={() => filter.toggle('terminated')}
              />
            }
            label="Label"
          />

          <Stack gap={0.5}>
            {statuses.map(([statusKey, statusInfo]) => (
              <FormControlLabel
                key={statusKey}
                control={
                  <Checkbox
                    checked={filter.statuses.includes(statusInfo.order)}
                    onChange={() => filter.toggle('statuses', statusInfo.order)}
                    sx={{ padding: 0 }}
                  />
                }
                label={<StatusChip status={statusKey} />}
              />
            ))}
          </Stack>
        </Stack>
      </Accordion>

      <Hr />
    </Stack>
  );
}
