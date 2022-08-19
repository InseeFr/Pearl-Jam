import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '0.5em',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '1em',
  },
}));

const LabelledText = ({ labelText, text }) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <div className={classes.column}>
        {Array.isArray(labelText) ? (
          labelText.map(labelTextLine => (
            <Typography color="textSecondary">{labelTextLine}</Typography>
          ))
        ) : (
          <Typography color="textSecondary">{labelText}</Typography>
        )}
      </div>
      <Typography>{text}</Typography>
    </div>
  );
};

export default LabelledText;
