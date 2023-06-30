import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '20em',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '1em',
  },
  overflow: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

const LabelledText = ({ labelText, value }) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <div className={classes.column}>
        {Array.isArray(labelText) ? (
          labelText.map(labelTextLine => (
            <Typography key={labelTextLine} color="textSecondary">
              {labelTextLine}
            </Typography>
          ))
        ) : (
          <Typography color="textSecondary">{labelText}</Typography>
        )}
      </div>
      <Typography className={classes.overflow}>{value}</Typography>
    </div>
  );
};

export default LabelledText;
