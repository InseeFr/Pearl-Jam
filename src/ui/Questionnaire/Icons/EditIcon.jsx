import { makeStyles } from '@mui/styles';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';

const useStyles = makeStyles({
  icon: {
    marginLeft: '16px',
  },
});

export default function EditIcon() {
  const classes = useStyles();
  return <EditNoteOutlinedIcon className={classes.icon} />;
}
