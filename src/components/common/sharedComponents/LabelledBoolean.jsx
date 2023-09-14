import MaterialIcons from 'utils/icons/materialIcons';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightMargin: { marginRight: '1em' },
}));

const LabelledBoolean = ({ labelText, value = undefined }) => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <Typography color="textSecondary" className={classes.rightMargin}>
        {labelText}
      </Typography>
      {value !== undefined && <MaterialIcons type={`${value ? 'checked' : 'cross'}`} />}
    </div>
  );
};

export default LabelledBoolean;
