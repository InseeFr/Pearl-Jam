import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  icon: {
    width: '15px',
    height: '15px',
    marginLeft: '5px',
  },
});

export default function DisturbIcon() {
  const classes = useStyles();
  return <DoDisturbIcon className={classes.icon} />;
}
