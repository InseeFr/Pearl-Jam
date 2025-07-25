import D from 'i18n';
import { NextCollectHistory, SurveyUnit } from 'types/pearl';
import { Grid, Typography } from '@mui/material';
import EditIcon from 'ui/Questionnaire/Icons/EditIcon';
import { NextContactsTable } from './tables/NextContactsTable';
import { InfoCard } from './InfoCard';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface AddressCardProps {
  surveyUnit: SurveyUnit;
}

export function NextCollectCard({ surveyUnit }: Readonly<AddressCardProps>) {
  return (
    <>
      <InfoCard>
        <PersonOutlineIcon fontSize="large" />
        <Typography component="h2" variant="xl" fontWeight={700}>
          {D.nextCollectInfo}
        </Typography>
      </InfoCard>
      <InfoCard>
        <Grid>
          <Typography fontWeight={600} color={'grey'}>
            {D.comment}
          </Typography>
          <NextContactsTable surveyUnit={surveyUnit} />
        </Grid>
      </InfoCard>
    </>
  );
}
