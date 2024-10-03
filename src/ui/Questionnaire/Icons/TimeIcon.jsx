import TimelapseIcon from '@mui/icons-material/Timelapse';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  icon: {
    color: '#FD8A02',
    width: '15px',
    height: '15px',
    marginLeft: '5px',
  },
});

export default function TimeIcon() {
  const classes = useStyles();
  return <TimelapseIcon className={classes.icon} />;
}
