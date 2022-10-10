import React, { useContext } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PersonIcon from '@material-ui/icons/Person';
import Skeleton from '@material-ui/lab/Skeleton';
import SurveyUnitContext from '../UEContext';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { getprivilegedPerson } from 'utils/functions';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {},
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1em',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '25em',
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
    lineHeight: 'initial',
  },
  bold: {
    fontWeight: 'bold',
  },
  overflow: { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' },
});

const InfoTile = () => {
  const { surveyUnit } = useContext(SurveyUnitContext);
  const { id } = surveyUnit;

  const classes = useStyles();
  const { firstName, lastName } = getprivilegedPerson(surveyUnit);
  const { campaign, sampleIdentifiers } = { ...surveyUnit };
  const { ssech } = { ...sampleIdentifiers };

  return surveyUnit !== undefined ? (
    <Card className={classes.root} elevation={0}>
      <CardContent className={classes.column}>
        <div className={classes.row}>
          <PersonIcon />
          <Typography
            className={clsx(classes.bold, classes.overflow)}
          >{`${firstName} ${lastName}`}</Typography>
        </div>
        <div className={classes.row}>
          <Typography
            color="textSecondary"
            align="center"
            className={clsx(classes.rounded, classes.title)}
          >
            {ssech}
          </Typography>
          <Typography className={clsx(classes.title, classes.overflow)} color="textSecondary">
            {campaign}
          </Typography>
        </div>
        <Typography color="error" variant="h6" className={clsx(classes.title, classes.bold)}>
          {`# ${id}`}
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Skeleton variant="rect" width={210} height={78} />
  );
};

export default InfoTile;
