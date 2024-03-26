import React from 'react'
import { makeStyles } from '@mui/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const useStyles = makeStyles({
  
  icon: {
    color:"#089616",
    width:"15px",
    height:"15px",
    marginLeft:"5px"
  },
});

export default function CircleIcon() {
  const classes = useStyles();
  return (
    <CheckCircleRoundedIcon className={classes.icon} />
  )
}
