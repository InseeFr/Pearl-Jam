import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: '1em',
  },
}));

export const LabelledSwitch = ({ labelText, text, value, onChangeFunction }) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <Typography color="textSecondary" className={classes.marginRight}>
        {labelText}
      </Typography>
      <Typography>{text}</Typography>
      <Switch checked={value ?? false} onChange={onChangeFunction} />
    </div>
  );
};
