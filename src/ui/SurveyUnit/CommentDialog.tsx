import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { PrivilegedPerson } from './PrivilegedPerson';
import { getCommentByType } from '../../utils/functions';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';
import D from 'i18n';
import { CommentField } from '../Fields/CommentField';

interface CommentDialogProps {
  surveyUnit: SurveyUnit;
  open: boolean;
  onClose: () => void;
}

/**
 * Dialog to add a new comment to a survey unit
 *
 * @param {SurveyUnit} surveyUnit
 * @param {boolean} open
 * @param {() => void} onClose
 */
export function CommentDialog({ surveyUnit, open, onClose }: CommentDialogProps) {
  const baseComment = getCommentByType('INTERVIEWER', surveyUnit);
  const [comment, setComment] = useState(baseComment);

  const handleCancel = () => {
    setComment(baseComment);
    onClose();
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
    <Dialog open={open} onClose={close}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{D.investigatorMessage}</DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <PrivilegedPerson surveyUnit={surveyUnit} />
            <CommentField value={comment} onChange={setComment} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: 'white' }} variant="contained" type="button" onClick={handleCancel}>
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
