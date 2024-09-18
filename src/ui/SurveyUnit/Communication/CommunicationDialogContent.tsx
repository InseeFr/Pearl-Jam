import { DialogTitle, DialogContent, Box, RadioGroup, Stack } from '@mui/material';
import { RadioLine } from '../../RadioLine';
import { useEffect, useState } from 'react';

interface CommunicationDialogContentProps {
  step: string;
  options: {
    label: string;
    value: string;
    disabled : boolean
  }[];
  setCommunicationValue: Function;
  title: string;
  lastPickedPropValue: string;
}

const CommunicationDialogContent = ({
  step,
  options,
  setCommunicationValue,
  title,
  lastPickedPropValue,
}: CommunicationDialogContentProps) => {
  console.log(options);
  console.log(options.find(o => !o.disabled)?.value);

    
  const [value, setValue] = useState(
    options.find(o => o.value === lastPickedPropValue) ? lastPickedPropValue : (options.find(o => !o.disabled)?.value) ?? []
  );

  useEffect(() => {
    setCommunicationValue(value, step);
  }, [value]);


  return (
    <>
      <DialogTitle id="dialogtitle">{title}</DialogTitle>
      <DialogContent>
        <Box>
          <RadioGroup
            onChange={e => setValue(e.target.value)}
            row
            aria-labelledby="dialogtitle"
            name="communication-radio-group"
            value={value}
          >
            <Stack gap={1} width={1}>
              {options.map(o => (
                <RadioLine value={o.value} label={o.label} disabled={o.disabled} />
              ))}
            </Stack>
          </RadioGroup>
        </Box>
      </DialogContent>
    </>
  );
};
export default CommunicationDialogContent;
