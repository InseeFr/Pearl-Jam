import { FilledInput } from '@mui/material';
import { Typography } from '../Typography';
import Stack from '@mui/material/Stack';
import React, { FunctionComponent, useState } from 'react';
import { getCommentByType } from '../../utils/functions';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import D from 'i18n';

interface CommentFormProps {
  surveyUnit: SurveyUnit;
  wrapper: FunctionComponent;
}

/**
 * @param {SurveyUnit} surveyUnit
 * @param {FunctionComponent} wrapper
 */
export function CommentForm({ surveyUnit, wrapper: WrapperComponent }: CommentFormProps) {
  const baseComment = getCommentByType('INTERVIEWER', surveyUnit);
  const [comment, setComment] = useState(baseComment);
  const maxChar = 999;

  const handleChange = (e: { target: { value: string | any[] } }) => {
    setComment(e.target.value.slice(0, maxChar));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const comments = [
      { type: 'MANAGEMENT', value: getCommentByType('MANAGEMENT', surveyUnit) },
      { type: 'INTERVIEWER', value: comment },
    ];
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      comments: comments,
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <WrapperComponent>
        <Stack gap={1}>
          <FilledInput
            sx={{
              padding: '0rem',
              width: 550,
            }}
            inputProps={{
              sx: {
                padding: '1rem',
              },
            }}
            minRows={8}
            maxRows={8}
            value={comment}
            onChange={handleChange}
            variant="filled"
            label="Commentaire"
            multiline
            placeholder={D.enterComment}
          />
          <Typography variant="xs" color="textHint" textAlign="right">
            {comment.length}/{maxChar}
          </Typography>
        </Stack>
      </WrapperComponent>
    </form>
  );
}
