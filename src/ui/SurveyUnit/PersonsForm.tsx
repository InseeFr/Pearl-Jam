import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Fragment, MouseEventHandler } from 'react';
import Stack from '@mui/material/Stack';
import D from '../../i18n/build-dictionary';
import { FieldRow } from '../FieldRow';
import { Control, Controller, useFieldArray, useForm, UseFormRegister } from 'react-hook-form';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import { Row } from '../Row';
import Divider from '@mui/material/Divider';
import { TITLES } from '../../utils/constants';
import { Typography } from '../Typography';
import IconButton from '@mui/material/IconButton';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OutlinedInput from '@mui/material/OutlinedInput';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { PaperIconButton } from '../PaperIconButton';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import { InputProps } from '@mui/material';
import { SurveyUnit, SurveyUnitPerson, SurveyUnitPhoneNumber } from 'types/pearl';

interface PersonsFormProps {
  onClose: () => void;
  surveyUnit: SurveyUnit;
  persons: SurveyUnitPerson[];
}
/**
 * Form to edit multiple persons attached to a surveyUnit
 *
 * @param {() => void} onClose
 * @param {SurveyUnit} surveyUnit
 * @param {SurveyUnitPerson[]} persons
 * @returns {JSX.Element}
 */
export function PersonsForm({ onClose, surveyUnit, persons }: Readonly<PersonsFormProps>) {
  const { register, handleSubmit, control } = useForm({
    // input persons is sorted and its order could be different from surveyUnit.persons used by useForm
    // => force the same order of persons in surveyUnit
    defaultValues: { ...surveyUnit, persons: persons },
  });

  const onSubmit = handleSubmit(data => {
    surveyUnitIDBService.addOrUpdate({
      ...surveyUnit,
      persons: data.persons,
    });
    onClose();
  });

  const handleCancel = (e: MouseEventHandler<HTMLAnchorElement, HTMLMouse>) => {
    onClose();
  };

  return (
    <Dialog maxWidth="md" open={true} onClose={onClose}>
      <form action="" onSubmit={onSubmit}>
        <DialogTitle>{D.surveyUnitIndividual}</DialogTitle>
        <DialogContent>
          <Row gap={3} alignItems="start">
            {persons.map((p, k) => (
              <Fragment key={p.id}>
                {k > 0 && <Divider orientation="vertical" flexItem />}
                <PersonFields index={k} person={p} register={register} control={control} />
              </Fragment>
            ))}
          </Row>
        </DialogContent>
        <DialogActions>
          <Button type="button" color="primary" variant="contained" onClick={e => handleCancel(e)}>
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

interface PersonFieldsProps {
  person: SurveyUnitPerson;
  register: (s: string) => InputProps | UseFormRegister<any>;
  control: Control<any>;
  index: number;
}
/**
 * Fields for a specific Person
 */
function PersonFields({ person, register, control, index }: Readonly<PersonFieldsProps>) {
  const titles = [
    { label: TITLES.MISS.value, value: TITLES.MISS.type },
    { label: TITLES.MISTER.value, value: TITLES.MISTER.type },
  ];
  const phoneNumberIndexForSource = (source: string) =>
    person.phoneNumbers.findIndex(n => n.source === source);
  const phoneIndexFiscal = phoneNumberIndexForSource('FISCAL');
  const phoneIndexDirectory = phoneNumberIndexForSource('DIRECTORY');

  const {
    fields: phoneNumbers,
    remove,
    append,
  } = useFieldArray({
    name: `persons.${index}.phoneNumbers`,
    control: control,
  });

  const addPhoneNumber = () => {
    append({ favorite: false, number: '', source: 'INTERVIEWER' });
  };

  return (
    <Stack gap={2}>
      <FieldRow
        label={D.surveyUnitTitle}
        name={`persons.${index}.title`}
        type="radios"
        required
        options={titles}
        control={control}
      />
      <FieldRow required label={D.surveyUnitLastName} {...register(`persons.${index}.lastName`)} />
      <FieldRow
        required
        label={D.surveyUnitFirstName}
        {...register(`persons.${index}.firstName`)}
      />
      <FieldRow
        label={D.surveyUnitDateOfBirth}
        name={`persons.${index}.birthdate`}
        type="datepicker"
        control={control}
      />
      <FieldRow label={D.surveyUnitEmail} {...register(`persons.${index}.email`)} />
      <Typography as="div" color="textTertiary" variant="s">
        {D.telephone}
      </Typography>
      <PhoneLine
        control={control}
        label={D.fiscalSource}
        name={`persons.${index}.phoneNumbers.${phoneIndexFiscal}`}
        phoneNumber={person.phoneNumbers[phoneIndexFiscal]}
        editable={undefined}
      />
      <PhoneLine
        control={control}
        label={D.directorySource}
        name={`persons.${index}.phoneNumbers.${phoneIndexDirectory}`}
        phoneNumber={person.phoneNumbers[phoneIndexDirectory]}
      />
      {phoneNumbers.map(
        (phoneNumber, k) =>
          phoneNumber.source === 'INTERVIEWER' && (
            <PhoneLine
              key={phoneNumber.id}
              editable
              control={control}
              label={D.interviewerSource}
              name={`persons.${index}.phoneNumbers.${k}`}
              phoneNumber={phoneNumber}
              onRemove={() => remove(k)}
            />
          )
      )}
      <Box ml="110px">
        <Button
          onClick={addPhoneNumber}
          variant="edge"
          startIcon={
            <PaperIconButton component="span">
              <AddIcon />
            </PaperIconButton>
          }
        >
          {D.addPhoneNumberButton}
        </Button>
      </Box>
    </Stack>
  );
}

interface PhoneLineProps {
  phoneNumber?: SurveyUnitPhoneNumber;
  label: string;
  name: string;
  control: Control;
  editable?: boolean;
  onRemove?: () => void;
}

/**
 * Displays a phone number with a star button
 */
function PhoneLine({
  control,
  label,
  name,
  phoneNumber,
  editable,
  onRemove,
}: Readonly<PhoneLineProps>) {
  if (!phoneNumber) {
    return null;
  }
  return (
    <Row justifyContent="space-between">
      <Row
        sx={{
          display: 'grid',
          gridTemplateColumns: '110px 130px 20px',
          gap: '1rem',
          minHeight: 24,
        }}
      >
        <Typography as="div" color="textHint" variant="xs">
          &nbsp; • {label} :
        </Typography>
        {editable ? (
          <Controller
            control={control}
            render={({ field }) => <OutlinedInput {...field} sx={{ maxWidth: 300 }} id={name} />}
            name={`${name}.number`}
          />
        ) : (
          <Typography as="div" color="textPrimary" variant="s">
            {phoneNumber?.number ?? '-'}
          </Typography>
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <IconButton sx={{ py: 0 }} onClick={() => field.onChange(!field.value)}>
              {field.value ? (
                <StarIcon size="small" color="yellow" />
              ) : (
                <StarBorderIcon size="small" color="surfaceTertiary" />
              )}
            </IconButton>
          )}
          name={`${name}.favorite`}
        />
      </Row>
      {editable && (
        <Row gap={2}>
          <IconButton onClick={onRemove}>
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Row>
      )}
    </Row>
  );
}
