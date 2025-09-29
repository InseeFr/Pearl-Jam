import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import D from 'i18n';
import { communicationMediumEnum, communicationStatusEnum } from 'utils/enum/CommunicationEnums';
import { useToggle } from '../../../utils/hooks/useToggle';
import { Row } from '../../Row';
import { Typography } from '../../Typography';
import { CommunicationForm } from './CommunicationForm';
import { CommunicationItem } from './CommunicationItem';
import { SurveyUnit, SurveyUnitCommunicationTemplate } from 'types/pearl';

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

export function CommunicationsCard({ surveyUnit }: Readonly<CommunicationsCardProps>) {
  const [showModal, toggleModal] = useToggle(false);
  const communicationTemplates = getCommunicationTemplates(surveyUnit.communicationTemplates)(
    surveyUnit.useLetterCommunication
  );

  // Sorting com requests by initialization date
  const surveyUnitCommunicationRequests = surveyUnit.communicationRequests
    ?.map(comReq => {
      const template = communicationTemplates.find(c => c.id === comReq.communicationTemplateId);
      return { ...comReq, template };
    })
    .sort((a, b) => {
      const dateA =
        a.status.find(s => s.status === communicationStatusEnum.INITIATED.value)?.date ?? 0;
      const dateB =
        b.status.find(s => s.status === communicationStatusEnum.INITIATED.value)?.date ?? 0;

      return dateB - dateA;
    });

  return (
    <>
      <Card>
        <CardContent>
          <Stack gap={3}>
            <Row gap={1} key={surveyUnit.id}>
              <CampaignIcon fontSize="large" />
              <Typography component="h2" variant="xl" fontWeight={700}>
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
              {surveyUnitCommunicationRequests?.map(comReq => (
                <CommunicationItem
                  surveyUnitCommunicationTemplate={comReq.template}
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
