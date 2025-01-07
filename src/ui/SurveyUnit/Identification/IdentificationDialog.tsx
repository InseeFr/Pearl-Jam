import {
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  Stack,
  DialogActions,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { RadioLine } from 'ui/RadioLine';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import {
  IdentificationQuestionValue,
  IdentificationQuestionOption,
} from 'utils/functions/identifications/identificationFunctions';
import D from 'i18n';

interface IdentificationDialogProps {
  question?: IdentificationQuestionValue;
  questionId: IdentificationQuestionsId;
  defaultOption?: IdentificationQuestionOption;
  onClose: () => void;
  onSubmit: (questionId: IdentificationQuestionsId, option: IdentificationQuestionOption) => void;
}

export function IdentificationDialog({
  question,
  questionId,
  defaultOption,
  onClose,
  onSubmit,
}: Readonly<IdentificationDialogProps>) {
  const options = question?.options;
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleChange = (newOption: IdentificationQuestionOption) => {
    setSelectedOption(newOption);
  };

  return (
    <Dialog maxWidth="sm" open={question ? question.text.length > 0 : false} onClose={onClose}>
      <DialogTitle id="identification-title">{question?.text}</DialogTitle>
      <DialogContent>
        <RadioGroup
          onChange={e =>
            handleChange({
              value: e.target.value,
              label: options?.find(o => o.value === e.target.value)?.label ?? 'Missing label',
              concluding:
                options?.find(o => o.value === e.target.value)?.concluding ?? D.missingLabel,
            })
          }
          defaultValue={selectedOption?.value}
          aria-labelledby="identification-title"
          name="identification-radio-group"
        >
          <Stack gap={1}>
            {options?.map((option: IdentificationQuestionOption) => (
              <RadioLine
                value={option.value}
                key={option.value}
                label={option.label}
                disabled={false}
              />
            ))}
          </Stack>
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button type="button" color="primary" variant="contained" onClick={onClose}>
          {D.cancelButton}
        </Button>
        {selectedOption && (
          <Button
            variant="contained"
            type="button"
            disabled={!selectedOption}
            onClick={() => {
              onClose();
              onSubmit(questionId, selectedOption);
            }}
          >
            {D.confirmButton}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
