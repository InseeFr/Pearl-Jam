import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '../Typography';
import D from 'i18n';
import { Row } from '../Row';
import Stack from '@mui/material/Stack';
import { getCommentByType } from '../../utils/functions';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CommentIcon from '@mui/icons-material/Comment';
import { CommentField } from '../Fields/CommentField';
import { surveyUnitIDBService } from '../../utils/indexeddb/services/surveyUnit-idb-service';

/**
 * @param {SurveyUnit} surveyUnit
 */
export function CommentCard({ surveyUnit }) {
  const baseComment = getCommentByType('INTERVIEWER', surveyUnit);
  const [comment, setComment] = useState(baseComment);
  const handleSubmit = e => {
    e.preventDefault();
    const comments = [
      { type: 'MANAGEMENT', value: getCommentByType('MANAGEMENT', surveyUnit) },
      { type: 'INTERVIEWER', value: comment },
    ];
    surveyUnitIDBService.addOrUpdateSU({
      ...surveyUnit,
      comments: comments,
    });
  };
  const canSubmit = comment !== baseComment;
  return (
    <Card p={2} elevation={0}>
      <CardContent>
        <Stack gap={3} component="form" onSubmit={handleSubmit}>
          <Row gap={1}>
            <CommentIcon fontSize="large" />
            <Typography as="h2" variant="xl" fontWeight={700}>
              {D.goToCommentsPage}
            </Typography>
          </Row>
          <Stack gap={2} alignItems="stretch">
            <CommentField value={comment} onChange={setComment} />
            <Button variant="contained" type="submit" disabled={!canSubmit}>
              {D.saveButton}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
