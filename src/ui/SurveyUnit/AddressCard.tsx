import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Stack from '@mui/material/Stack';
import { getAddressData } from '../../utils/functions';
import { TextWithLabel } from '../TextWithLabel';
import Button from '@mui/material/Button';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { useToggle } from '../../utils/hooks/useToggle';
import { AddressForm } from './AddressForm';
import Card from '@mui/material/Card';

interface AddressCardProps {
  surveyUnit: SurveyUnit;
}

/**
 * @param {SurveyUnit} surveyUnit
 */
export function AddressCard({ surveyUnit }: AddressCardProps) {
  const address = getAddressData(surveyUnit.address);
  const [showModal, toggleModal] = useToggle(false);

  return (
    <>
      <Card p={2} elevation={0}>
        <CardContent>
          <Stack gap={3}>
            <Row justifyContent="space-between">
              <Row gap={1}>
                <HomeOutlinedIcon fontSize="large" />
                <Typography as="h2" variant="xl" fontWeight={700}>
                  {D.surveyUnitHousing}
                </Typography>
              </Row>
              <Button
                onClick={toggleModal}
                sx={{ color: 'surfaceSecondary', variant: 'edge' }}
                startIcon={<BorderColorOutlinedIcon fontSize="small" />}
              >
                {D.editButton}
              </Button>
            </Row>
            <Stack gap={0.5}>
              <TextWithLabel label={D.addressStreetName}>{address.streetName}</TextWithLabel>
              <TextWithLabel label={D.addressAdditionalAddress}>
                {address.additionalAddress}
              </TextWithLabel>
              <TextWithLabel label={D.addressPostcode}>{address.postCode}</TextWithLabel>
              <TextWithLabel label={D.addressCity}>{address.cityName}</TextWithLabel>
              <TextWithLabel label={D.addressLocality}>{address.locality}</TextWithLabel>
              <TextWithLabel label={D.addressBuilding}>{address.building}</TextWithLabel>
              <TextWithLabel label={D.addressDeliveryPoint}>{address.deliveryPoint}</TextWithLabel>
              <TextWithLabel label={D.addressFloor}>{address.floor}</TextWithLabel>
              <TextWithLabel label={D.addressDoor}>{address.door}</TextWithLabel>
              <TextWithLabel label={D.addressStaircase}>{address.staircase}</TextWithLabel>
              <TextWithLabel label={D.addressElevator}>{address.elevator}</TextWithLabel>
              <TextWithLabel label={D.addressCityPriorityDistrict}>
                {address.cityPriorityDistrict}
              </TextWithLabel>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {showModal && <AddressForm surveyUnit={surveyUnit} onClose={toggleModal} />}
    </>
  );
}
