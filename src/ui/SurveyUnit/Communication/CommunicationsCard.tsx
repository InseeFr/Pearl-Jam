import CardContent from '@mui/material/CardContent';
import { Typography } from '../../Typography';
import D from 'i18n';
import { Row } from '../../Row';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useToggle } from '../../../utils/hooks/useToggle';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import { CommunicationForm } from '../CommunicationForm';
import { CommunicationItem } from './CommunicationItem';
import Card from '@mui/material/Card/Card';

interface CommunicationsCardProps {
  surveyUnit: SurveyUnit;
}

/**
 * @param {SurveyUnit} surveyUnit
 */
export function CommunicationsCard({ surveyUnit }: CommunicationsCardProps) {
  const [showModal, toggleModal] = useToggle(false);
  const communicationTemplates = surveyUnit.communicationTemplates;

  return (
    <>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1}>
              <CampaignIcon fontSize="large" />
              <Typography as="h2" variant="xl" fontWeight={700}>
                {D.surveyUnitCommunications}
              </Typography>
            </Row>
            <Button
              disabled={communicationTemplates.length === 0}
              onClick={toggleModal}
              variant="contained"
              startIcon={<AddIcon />}
            >
              {D.sendCommunication}
            </Button>
            <Stack gap={2}>
              {surveyUnit.communicationRequests?.map(v => (
                <CommunicationItem surveyUnitCommunicationTemplate={communicationTemplates.find(c => c.id === v.communicationTemplateId)} communication={v} key={v.status[0].date ?? 1} />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {showModal && <CommunicationForm surveyUnit={surveyUnit} onClose={toggleModal} />}
    </>
  );
}