import D from 'i18n';
import { SurveyUnit } from 'types/pearl';
import { Grid, Typography } from '@mui/material';
import { NextContactsTable } from './tables/NextContactsTable';
import { InfoCard } from './InfoCard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface AddressCardProps {
  surveyUnit: SurveyUnit;
}

export function NextCollectCard({ surveyUnit }: Readonly<AddressCardProps>) {
  return (
    <InfoCard>
      <Grid container direction="column">
        <Grid container item direction="row" alignItems="center" spacing={0.5}>
          <Grid item>
            <PersonOutlineIcon fontSize="large" />
          </Grid>
          <Grid item>
            <Typography component="h2" variant="h6" fontWeight={700}>
              {D.nextSurveyInfo}
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <NextContactsTable surveyUnit={surveyUnit} />
        </Grid>
      </Grid>
    </InfoCard>
  );
}
