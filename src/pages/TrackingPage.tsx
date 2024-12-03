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
import { useSurveyUnits } from '../utils/hooks/database';
import { useMemo, useState, useEffect } from 'react';
import { Row } from '../ui/Row';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Select } from '../ui/Select';
import D from 'i18n';
import { StatsTracking } from './StatsTracking';
import { TableTracking } from './TableTracking';
import { SelectChangeEvent } from '@mui/material';
import { SurveyUnit } from 'types/pearl';

export const Component = () => {
  const surveyUnits: SurveyUnit[] = useSurveyUnits();
  const [campaign, setCampaign] = useState<string>(() => {
    return localStorage.getItem('selectedCampaign') ?? '';
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
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
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
                      onChange={(e: SelectChangeEvent<unknown>) =>
                        setCampaign(e.target.value as string)
                      }
                      sx={{ minWidth: 210 }}
                      value={campaign}
                      placeholder={D.trackingSelect}
                      options={campaigns}
                      allowEmpty={false}
                    />
                    {campaign && (
                      <IconButton aria-label="reset" onClick={() => setCampaign('')}>
                        <RestartAltIcon />
                      </IconButton>
                    )}
                    <TextField
                      label={D.trackingSearchField}
                      variant="outlined"
                      size="small"
                      value={searchText}
                      onChange={e => handleSearchTextChange(e.currentTarget.value)}
                      sx={{ marginLeft: 0.5, marginRight: 2, width: '500px' }}
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
              <StatsTracking surveyUnits={surveyUnits} />
            ) : (
              <TableTracking
                surveyUnits={surveyUnits}
                campaign={campaign}
                searchText={searchText}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
