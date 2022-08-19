import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import { getprivilegedPerson } from 'utils/functions';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { useSurveyUnit } from 'utils/hooks/database';

const useStyles = makeStyles({
  root: { paddingRight: '3em' },
  row: { display: 'flex', flexDirection: 'row' },
  column: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
    '&:last-child': { paddingBottom: '0px' },
  },
  title: {
    fontSize: 14,
  },
  skeleton: {
    height: '5em',
    justifySelf: 'flex-end',
  },
  rounded: {
    borderRadius: '50%',
    backgroundColor: grey[200],
    width: '1.4em',
    height: '1.4em',
    marginRight: '1em',
    lineHeight: 'initial',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const InfoTile = () => {
  const { id } = useParams();
  const surveyUnit = useSurveyUnit(id);

  const classes = useStyles();
  const { firstName, lastName } = getprivilegedPerson(surveyUnit);
  const { campaign, sampleIdentifiers } = { ...surveyUnit };
  const { ssech } = { ...sampleIdentifiers };

  return surveyUnit !== undefined ? (
    <Card className={classes.root} elevation={0}>
      <CardContent className={classes.column}>
        <Typography className={`${classes.row} ${classes.bold}`}>
          <PersonIcon />
          {`${firstName} ${lastName}`}
        </Typography>
        <div className={classes.row}>
          <Typography
            color="textSecondary"
            align="center"
            className={`${classes.rounded} ${classes.title}`}
          >
            {ssech}
          </Typography>
          <Typography className={classes.title} color="textSecondary">
            {campaign}
          </Typography>
        </div>
        <Typography
          color="error"
          variant="h6"
          className={`${classes.title} ${classes.bold}`}
          // color="textSecondary"
        >
          {`# ${id}`}
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Skeleton variant="rect" width={210} height={78} />
  );
};

export default InfoTile;
