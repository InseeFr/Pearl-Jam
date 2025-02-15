import { Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { SurveyUnit } from 'types/pearl';
import { surveyUnitStateEnum } from 'utils/enum/SUStateEnum';
import { addNewState, persistSurveyUnit } from 'utils/functions';
import CheckIcon from '@mui/icons-material/Check';
import SendIcon from '@mui/icons-material/Send';

interface SubmitButtonProp {
  surveyUnit: SurveyUnit;
}

/**
 * Transmit button to sync a surveyUnit
 */
export function SubmitButton({ surveyUnit }: Readonly<SubmitButtonProp>) {
  const handleSubmit = () => {
    const newStates = addNewState(surveyUnit, surveyUnitStateEnum.WAITING_FOR_SYNCHRONIZATION.type);
    persistSurveyUnit({ ...surveyUnit, states: newStates });
  };

  return (
    <Box position="relative">
      <Box position="absolute" sx={{ left: -20, top: -10 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 31 44"
          width={31}
          height={44}
        >
          <path
            fill="#D7DBE1"
            d="m18.894 36.447.017-1-.017 1Zm11.52.901a1 1 0 0 0 .024-1.414l-6.256-6.47a1 1 0 1 0-1.437 1.39l5.56 5.752-5.75 5.56a1 1 0 1 0 1.39 1.439l6.47-6.257ZM20.157 1.001l-.016 1 .016-1ZM5.16 8.547l.813.582-.813-.582Zm-.18.25-.812-.582.813.582ZM2.67 24.684l.946-.327-.945.327Zm16.207 12.763 10.826.182.033-2-10.825-.181-.034 2ZM22.965.048 20.173.001l-.033 2 2.791.047.034-2ZM4.348 7.964l-.18.251L5.794 9.38l.18-.251-1.627-1.165ZM20.172.001A19.073 19.073 0 0 0 4.348 7.964L5.973 9.13A17.073 17.073 0 0 1 20.14 2.001l.033-2ZM1.726 25.011a18.476 18.476 0 0 0 17.151 12.436l.034-2a16.476 16.476 0 0 1-15.295-11.09l-1.89.653Zm1.89-.654A16.476 16.476 0 0 1 5.794 9.38L4.168 8.215A18.476 18.476 0 0 0 1.726 25.01l1.89-.653Z"
          />
        </svg>
      </Box>
      <Box position="absolute" sx={{ left: '50%', transform: 'translateX(-50%)' }}>
        <Button
          onClick={handleSubmit}
          color="secondary"
          variant="contained"
          size="small"
          sx={{ width: 82, height: 30, margin: '10px auto 0 auto', display: 'flex' }}
        >
          <SendIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}
