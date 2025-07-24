import CardContent from '@mui/material/CardContent';
import D from 'i18n';
import Stack from '@mui/material/Stack';
import { NextCollectHistory } from 'types/pearl';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { Row } from 'ui/Row';
import { useToggle } from 'utils/hooks/useToggle';
import EditIcon from 'ui/Questionnaire/Icons/EditIcon';

interface AddressCardProps {
  nextCollectHistory: NextCollectHistory;
}

export function NextCollectCard({ nextCollectHistory }: Readonly<AddressCardProps>) {
  return (
    <>
      eqeq
      <Card elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row justifyContent="space-between">
              <Row gap={1}>
                <EditIcon />
                <Typography component="h2" variant="xl" fontWeight={700}>
                  {D.nextCollectInfo}
                </Typography>
              </Row>
            </Row>
          </Stack>
        </CardContent>
      </Card>
      <Card elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row justifyContent="space-between">
              <Row gap={1}>
                <EditIcon />
                <Typography component="h2" variant="xl" fontWeight={700}>
                  {}
                </Typography>
              </Row>
            </Row>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
