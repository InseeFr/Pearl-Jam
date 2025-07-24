import D from 'i18n';
import { PreviousCollectHistory } from 'types/pearl';
import { Grid, Typography } from '@mui/material';
import { InfoCard } from './InfoCard';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { PreviousContactsTable } from './tables/PreviousContactsTable';

type AddressCardProps = {
  previousCollectHistory: PreviousCollectHistory;
};

export function PreviousCollectCard({ previousCollectHistory }: Readonly<AddressCardProps>) {
  return (
    <>
      <InfoCard>
        <AssignmentOutlinedIcon />
        <Typography component="h2" variant="xl">
          {D.previousCollectInfo}
        </Typography>
      </InfoCard>
      <InfoCard>
        <Typography fontWeight={600} color={'grey'}>
          Outcome comment :
        </Typography>
        <Typography fontWeight={600}>{previousCollectHistory.outcome}</Typography>
      </InfoCard>
      <InfoCard>
        <Grid>
          <Typography fontWeight={600} color={'grey'}>
            Composition
          </Typography>
          <PreviousContactsTable contacts={previousCollectHistory.houseHoldComposition} />
        </Grid>
      </InfoCard>
      <InfoCard>
        <Typography fontWeight={600} color={'grey'}>
          Comment :
        </Typography>
        <Typography fontWeight={600}>
          {previousCollectHistory.interviewerComment.toString()}
        </Typography>
      </InfoCard>
    </>
  );
}
