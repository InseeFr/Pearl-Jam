import { TableRow, TableCell, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { SurveyUnit } from 'types/pearl';
import { PaperIconButton } from 'ui/PaperIconButton';
import { StatusChip } from 'ui/StatusChip';
import { CommentDialog } from 'ui/SurveyUnit/CommentDialog';
import {
  getprivilegedPerson,
  getSuTodoState,
  isSelectable,
  getSortedContactAttempts,
  getCommentByType,
  formatLastMailInfo,
  getLastSubmittedCommunication,
} from 'utils/functions';
import {
  findContactAttemptLabelByValue,
  findMediumLabelByValue,
} from 'utils/functions/contacts/ContactAttempt';
import { findContactOutcomeLabelByValue } from 'utils/functions/contacts/ContactOutcome';
import { useToggle } from 'utils/hooks/useToggle';
import { formatDate } from 'utils/functions/date';
import AddIcon from '@mui/icons-material/Add';

interface SurveyUnitRowProps {
  surveyUnit: SurveyUnit;
}

export function SurveyUnitRow({ surveyUnit }: Readonly<SurveyUnitRowProps>) {
  const person = getprivilegedPerson(surveyUnit);
  const state = getSuTodoState(surveyUnit);
  const isActive = isSelectable(surveyUnit);
  const lastContact = getSortedContactAttempts(surveyUnit)[0];
  const [showModal, toggleModal] = useToggle(false);
  const comment = getCommentByType('INTERVIEWER', surveyUnit);
  return (
    <>
      <TableRow>
        <TableCell align="center">
          {isActive ? (
            <Link to={`/survey-unit/${surveyUnit.id}/details`}>
              #{surveyUnit.displayName ?? surveyUnit.id}
            </Link>
          ) : (
            `#${surveyUnit.displayName ?? surveyUnit.id}`
          )}
        </TableCell>
        <TableCell align="center">
          {person.lastName.toUpperCase()} {person.firstName}
        </TableCell>
        <TableCell align="center">
          <StatusChip status={state} />
        </TableCell>
        <TableCell align="center">
          {formatLastMailInfo(getLastSubmittedCommunication(surveyUnit))}
        </TableCell>
        <TableCell align="center">
          {lastContact && (
            <>
              <Typography component="span" variant="s" color="textPrimary">
                {findContactAttemptLabelByValue(lastContact.status)}
                <br />
                {findMediumLabelByValue(lastContact.medium)}
              </Typography>
              {' | '}
              <Typography component="span" variant="s" color="textTertiary">
                {formatDate(lastContact.date)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          {surveyUnit.contactOutcome && (
            <>
              <Typography component="span" variant="s" color="textPrimary">
                {findContactOutcomeLabelByValue(surveyUnit.contactOutcome.type)}
              </Typography>
              <br />
              <Typography component="span" variant="s" color="textTertiary">
                {formatDate(surveyUnit.contactOutcome.date)}
              </Typography>
            </>
          )}
        </TableCell>
        <TableCell align="center">
          {comment ? (
            <Typography
              textAlign="center"
              onClick={toggleModal}
              role="button"
              component="span"
              sx={{ maxWidth: '10em', display: 'inline-block', cursor: 'pointer' }}
              noWrap
              variant="s"
              color="inherit"
            >
              {comment}
            </Typography>
          ) : (
            <PaperIconButton onClick={toggleModal}>
              <AddIcon fontSize="small" color="textPrimary" />
            </PaperIconButton>
          )}
        </TableCell>
      </TableRow>
      <CommentDialog surveyUnit={surveyUnit} open={showModal} onClose={toggleModal} />
    </>
  );
}
