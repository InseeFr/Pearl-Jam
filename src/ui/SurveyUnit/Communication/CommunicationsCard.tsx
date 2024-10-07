import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { communicationMediumEnum } from 'utils/enum/CommunicationEnums';
import { useToggle } from '../../../utils/hooks/useToggle';
import { Row } from '../../Row';
import { Typography } from '../../Typography';
import { CommunicationForm } from '../CommunicationForm';
import { CommunicationItem } from './CommunicationItem';

interface CommunicationsCardProps {
  surveyUnit: SurveyUnit;
}

const getCommunicationTemplates = (
  communicationTemplates?: SurveyUnitCommunicationTemplate[]
): ((useLetterCommunication: boolean) => SurveyUnitCommunicationTemplate[]) => {
  return (useLetterCommunication: boolean) => {
    if (!communicationTemplates) {
      return [];
    }

    if (useLetterCommunication) {
      return communicationTemplates;
    }

    return communicationTemplates.filter(
      template => template.medium !== communicationMediumEnum.MEDIUM_MAIL.value
    );
  };
};

export function CommunicationsCard({ surveyUnit }: CommunicationsCardProps) {
  const [showModal, toggleModal] = useToggle(false);
  const communicationTemplates = getCommunicationTemplates(surveyUnit.communicationTemplates)(
    surveyUnit.useLetterCommunication
  );

  return (
    <>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1} key={surveyUnit.id}>
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
              {surveyUnit.communicationRequests?.map(comReq => (
                <CommunicationItem
                  surveyUnitCommunicationTemplate={communicationTemplates.find(
                    c => c.id === comReq.communicationTemplateId
                  )}
                  communication={comReq}
                  key={comReq.status[0].date ?? 1}
                />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {showModal && <CommunicationForm surveyUnit={surveyUnit} onClose={toggleModal} />}
    </>
  );
}
