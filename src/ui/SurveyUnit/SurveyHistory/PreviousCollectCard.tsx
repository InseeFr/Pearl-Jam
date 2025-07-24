import D from 'i18n';
import { PreviousCollectHistory } from 'types/pearl';
import { Grid, Typography } from '@mui/material';
import { useToggle } from 'utils/hooks/useToggle';
import EditIcon from 'ui/Questionnaire/Icons/EditIcon';
import { InfoCard } from './InfoCard';
import { ContactsTable } from './ContactsTable';

type AddressCardProps = {
  previousCollectHistory: PreviousCollectHistory;
};

export function PreviousCollectCard({ previousCollectHistory }: Readonly<AddressCardProps>) {
  const [showModal, toggleModal] = useToggle(false);

  return (
    <>
      <InfoCard>
        <EditIcon />
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
          <ContactsTable contacts={previousCollectHistory.houseHoldComposition} />
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
