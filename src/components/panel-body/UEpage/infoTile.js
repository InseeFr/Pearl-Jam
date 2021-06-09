import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import { Skeleton } from '@material-ui/lab';
import { getprivilegedPerson } from 'common-tools/functions';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const InfoTile = ({ refresh }) => {
  const [surveyUnit, setSurveyUnit] = useState(undefined);

  const { id } = useParams();

  useEffect(() => {
    surveyUnitDBService.getById(id).then(ue => {
      setSurveyUnit(ue);
    });
  }, [id, refresh]);

  const useStyles = makeStyles({
    root: { paddingRight: '3em' },
    row: { display: 'flex', flexDirection: 'row' },
    column: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      padding: '0px',
      '&:last-child': { paddingBottom: '0px' },
    },
    alignItems: { alignItems: 'center' },

    title: {
      fontSize: 14,
    },
    skeleton: {
      height: '5em',
      justifySelf: 'flex-end',
    },
    rounded: {
      border: '1px solid',
      borderRadius: '50%',
      width: '1.4em',
      height: '1.4em',
      marginLeft: '1em',
      lineHeight: 'initial',
    },
  });

  const classes = useStyles();
  const { firstName, lastName } = getprivilegedPerson(surveyUnit);
  const { campaign, sampleIdentifiers } = { ...surveyUnit };
  const { ssech } = { ...sampleIdentifiers };

  return surveyUnit !== undefined ? (
    <Card className={classes.root} elevation={0}>
      <CardContent className={classes.column}>
        <Typography
          component="h6"
          variant="h6"
          color="textSecondary"
          className={`${classes.row} ${classes.alignItems}`}
        >
          <PersonIcon />
          {`${firstName} ${lastName}`}
        </Typography>
        <div className={classes.row}>
          <Typography component="h6" variant="h6" className={classes.title} color="textSecondary">
            {campaign}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            align="center"
            className={`${classes.rounded} ${classes.title}`}
          >
            {ssech}
          </Typography>
        </div>
        <Typography component="h6" variant="h6" className={classes.title} color="textSecondary">
          {`# ${id}`}
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Skeleton variant="rect" width={210} height={78} />
  );
};

export default InfoTile;
