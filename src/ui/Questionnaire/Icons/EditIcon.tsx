import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  icon: {
    marginLeft: '16px',
  },
});

export default function EditIcon() {
  const classes = useStyles();
  return <EditNoteOutlinedIcon className={classes.icon} />;
}
