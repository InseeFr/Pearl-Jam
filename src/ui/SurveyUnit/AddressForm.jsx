import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { getAddressData } from '../../utils/functions';
import D from 'i18n';
import { FieldRow } from '../FieldRow';
import { useForm } from 'react-hook-form';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';

/**
 *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @returns {JSX.Element}
 */
export function AddressForm({ onClose, surveyUnit }) {
  const { register, handleSubmit, control } = useForm({
    defaultValues: getAddressData(surveyUnit.address),
  });

  const onSubmit = handleSubmit(data => {
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      address: {
        ...surveyUnit.address,
        l2: data.deliveryPoint,
        l3: data.additionalAddress,
        l4: data.streetName,
        l5: data.locality,
        l6: `${data.postCode} ${data.cityName}`,
        building: data.building,
        cityPriorityDistrict: !!data.cityPriorityDistrict,
        floor: data.floor,
        door: data.door,
        staircase: data.staircase,
        elevator: !!data.elevator,
      },
    });
    onClose();
  });

  const handleCancel = e => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog maxWidth="md" open={true} onClose={onClose}>
      <form action="" onSubmit={onSubmit}>
        <DialogTitle>{D.surveyUnitAddressChange}</DialogTitle>
        <DialogContent>
          <Stack gap={2} style={{ minWidth: 600 }}>
            <FieldRow label={D.addressStreetName} required {...register('streetName')} />
            <FieldRow label={D.addressAdditionalAddress} {...register('additionalAddress')} />
            <FieldRow label={D.addressLocality} {...register('locality')} />
            <FieldRow maxWidth={5} label={D.addressPostcode} required {...register('postCode')} />
            <FieldRow label={D.addressCity} required {...register('cityName')} />
            <FieldRow type="switch" label={D.addressElevator} control={control} name="elevator" />
            <FieldRow
              type="switch"
              label={D.addressCityPriorityDistrict}
              control={control}
              name="cityPriorityDistrict"
            />
            <FieldRow label={D.addressBuilding} {...register('building')} />
            <FieldRow label={D.addressDeliveryPoint} {...register('deliveryPoint')} />
            <FieldRow label={D.addressFloor} {...register('floor')} />
            <FieldRow label={D.addressDoor} {...register('door')} />
            <FieldRow label={D.addressStaircase} {...register('staircase')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="white" variant="contained" onClick={handleCancel}>
            {D.cancelButton}
          </Button>
          <Button variant="contained" type="submit">
            {D.saveButton}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
