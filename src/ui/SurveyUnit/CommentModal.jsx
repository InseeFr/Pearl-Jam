import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { Typography } from '../Typography';
import { PrivilegedPerson } from './PrivilegedPerson';
import { getCommentByType } from '../../utils/functions';
import { FilledInput } from '@mui/material';
import surveyUnitIDBService from '../../utils/indexeddb/services/surveyUnit-idb-service';

/**
 *
 * @param {SurveyUnit} surveyUnit
 * @param {boolean} open
 * @param {() => void} onClose
 */
export function CommentModal({ surveyUnit, open, onClose }) {
  const baseComment = getCommentByType('INTERVIEWER', surveyUnit);
  const [comment, setComment] = useState(baseComment);
  const maxChar = 999;

  console.log(surveyUnit);

  const handleSave = () => {
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

  const handleCancel = () => {
    setComment(baseComment);
    onClose();
  };

  const handleChange = e => {
    setComment(e.target.value.slice(0, maxChar));
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Commentaire enquêteur</DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <PrivilegedPerson surveyUnit={surveyUnit} />
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
              placeholder="Saisissez un commentaire..."
            />
            <Typography variant="xs" color="textHint" textAlign="right">
              {comment.length}/{maxChar}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="white" variant="contained" onClick={handleCancel}>
          Annuler
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={!comment}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
