import {
  DialogTitle,
  DialogContent,
  Box,
  RadioGroup,
  Stack,
  DialogActions,
  Button,
} from '@mui/material';
import { RadioLine } from '../../RadioLine';
import D from '../../../i18n/build-dictionary';

interface CommunicationDialogContentProps {
  options?: {
    label: string;
    value: string;
    disabled: boolean;
  }[];
  title: string;
  radioValue?: string;
  isFirst: boolean;
  nextStep: Function;
  onClose: Function;
  previousStep: Function;
  onChange: Function;
}

const CommunicationDialogContent = ({
  options,
  title,
  radioValue,
  isFirst,
  nextStep,
  onClose,
  previousStep,
  onChange,
}: CommunicationDialogContentProps) => {
  return (
    <>
      <DialogTitle id="dialogtitle">{title}</DialogTitle>
      <DialogContent>
        <Box>
          <RadioGroup
            onChange={e => onChange(e.target.value)}
            row
            aria-labelledby="dialogtitle"
            name="communication-radio-group"
            value={radioValue}
          >
            <Stack gap={1} width={1}>
              {options?.map(o => (
                <RadioLine value={o.value} label={o.label} disabled={o.disabled} key={o.value} />
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          color="white"
          variant="contained"
          onClick={() => (isFirst ? onClose() : previousStep())}
        >
          {isFirst ? D.cancelButton : D.previousButton}
        </Button>
        <Button variant="contained" onClick={() => nextStep()}>
          {D.confirmButton}
        </Button>
      </DialogActions>
    </>
  );
};
export default CommunicationDialogContent;
