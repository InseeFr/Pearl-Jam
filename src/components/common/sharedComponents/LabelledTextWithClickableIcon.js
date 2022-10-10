import LabelledText from './LabelledText';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const LabelledTextWithClickableIcon = ({ labelText, value, icon: Icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.row}>
      <LabelledText labelText={labelText} value={value} />
      <Icon />
    </div>
  );
};
