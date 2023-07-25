import { Typography, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import LabelledText from '../sharedComponents/LabelledText';
import { version } from '../../../../package.json';
import D from 'i18n';

const useStyles = makeStyles(() => ({
  innerPaper: {
    backgroundColor: 'lightgrey',
    borderRadius: '15px',
    padding: '1em',
    minWidth: '20em',
  },
  outterPaper: {
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    padding: '1em',
    gap: '1em',
    marginBottom: 'auto',
  },
  version: {
    color: 'darkGrey',
    alignSelf: 'flex-end',
    fontWeight: 'bold',
  },
}));

export const UserProfile = ({
  user = {
    firstName: 'Unknown',
    lastName: 'Interviewer',
    phoneNumber: '0123456789',
    email: 'no.data@y.et',
  },
}) => {
  const classes = useStyles();
  const { firstName, lastName, phoneNumber, email } = user;
  return (
    <Paper className={classes.outterPaper} elevation={0}>
      <Typography variant="h5">{D.myProfile}</Typography>
      <Paper className={classes.innerPaper} elevation={0}>
        <LabelledText labelText={`${D.profileLastName} :`} value={lastName} />
        <LabelledText labelText={`${D.profileFirstName} :`} value={firstName} />
        <LabelledText labelText={`${D.profileEmail} :`} value={email} />
        <LabelledText labelText={`${D.profilePhone} :`} value={phoneNumber} />
      </Paper>
      <Typography className={classes.version}>{`V.${version}`}</Typography>
    </Paper>
  );
};
