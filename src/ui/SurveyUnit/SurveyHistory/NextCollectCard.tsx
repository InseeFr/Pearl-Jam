import CardContent from '@mui/material/CardContent';
import D from 'i18n';
import Stack from '@mui/material/Stack';
import { NextCollectHistory } from 'types/pearl';
import Card from '@mui/material/Card';
import { Grid, Typography } from '@mui/material';
import { Row } from 'ui/Row';
import EditIcon from 'ui/Questionnaire/Icons/EditIcon';
import { NextContactsTable } from './tables/NextContactsTable';
import { InfoCard } from './InfoCard';

interface AddressCardProps {
  nextCollectHistory: NextCollectHistory;
}

export function NextCollectCard({ nextCollectHistory }: Readonly<AddressCardProps>) {
  return (
    <>
      <InfoCard>
        <EditIcon />
        <Typography component="h2" variant="xl" fontWeight={700}>
          {D.nextCollectInfo}
        </Typography>
      </InfoCard>
      <InfoCard>
        <Grid>
          <Typography fontWeight={600} color={'grey'}>
            Comment :
          </Typography>
          <NextContactsTable nextCollectHistory={nextCollectHistory} />
        </Grid>
      </InfoCard>
    </>
  );
}
