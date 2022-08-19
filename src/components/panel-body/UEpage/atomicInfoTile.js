import Divider from '@material-ui/core/Divider';
import LabelledBoolean from 'components/common/niceComponents/LabelledBoolean';
import LabelledText from 'components/common/niceComponents/LabelledText';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: { display: 'flex', flexDirection: 'row' },
  spaceAround: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
  },
}));

const AtomicInfoTile = ({ data, split = false }) => {
  const classes = useStyles();
  const lines = data.map(({ label, value }) => {
    switch (typeof value) {
      case 'boolean':
        return <LabelledBoolean labelText={label} value={value} />;
      default:
        return <LabelledText labelText={label} text={value} />;
    }
  });
  var firstHalf;
  var secondHalf;
  if (split) {
    const middleIndex = Math.ceil(lines.length / 2);
    firstHalf = lines.splice(0, middleIndex);
    secondHalf = lines.splice(-middleIndex);
  }

  return (
    <Paper className={classes.root} elevation={0}>
      {!split && lines}
      {split && (
        <div className={classes.row}>
          <div className={classes.column}>{firstHalf}</div>
          <Divider orientation="vertical" flexItem className={classes.spaceAround} />
          <div className={classes.column}>{secondHalf}</div>
        </div>
      )}
    </Paper>
  );
};

export default AtomicInfoTile;
AtomicInfoTile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }))
    .isRequired,
};
