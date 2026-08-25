import { Dialog, DialogTitle, DialogContent, RadioGroup, Stack, IconButton } from '@mui/material';
import { useState } from 'react';
import { RadioLine } from 'ui/RadioLine';
import { IdentificationQuestionsId } from 'utils/enum/identifications/IdentificationsQuestions';
import {
  IdentificationQuestionValue,
  IdentificationQuestionOption,
} from 'utils/functions/identifications/identificationFunctions';
import D from 'i18n';
import CloseIcon from '@mui/icons-material/Close';

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
    onClose();
    onSubmit(questionId, newOption);
  };

  return (
    <Dialog open={question ? question.text.length > 0 : false} onClose={onClose}>
      <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <DialogTitle id="identification-title">{question?.text}</DialogTitle>
        <IconButton
          aria-label={D.closeIconButton}
          onClick={onClose}
          sx={{ mr: 2, height: 'fit-content', width: 'fit-content' }}
        >
          <CloseIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <RadioGroup
          onChange={e =>
            handleChange({
              value: e.target.value,
              label: options?.find(o => o.value === e.target.value)?.label ?? D.missingLabel,
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
                onClick={() => handleChange(option)}
              />
            ))}
          </Stack>
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}
