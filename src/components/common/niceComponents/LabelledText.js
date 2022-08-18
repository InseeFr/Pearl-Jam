import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightMargin: { marginRight: '1em' },
}));

const LabelledText = ({ labelText, text }) => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <Typography color="textSecondary" className={classes.rightMargin}>
        {labelText}
      </Typography>
      <Typography>{text}</Typography>
    </div>
  );
};

export default LabelledText;
