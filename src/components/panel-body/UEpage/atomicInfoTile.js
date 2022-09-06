import Divider from '@material-ui/core/Divider';
import LabelledBoolean from 'components/common/niceComponents/LabelledBoolean';
import LabelledText from 'components/common/niceComponents/LabelledText';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5em',
  },
  row: { display: 'flex', flexDirection: 'row', gap: '1em' },
  // spaceAround: {
  //   marginLeft: '1em',
  //   marginRight: '1em',
  // },
}));

const AtomicInfoTile = ({ data, split = false }) => {
  const classes = useStyles();
  const lines = data.map(({ label, value }) => {
    switch (typeof value) {
      case 'boolean':
        return <LabelledBoolean labelText={label} value={value} />;
      default:
        return <LabelledText labelText={label} value={value} />;
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
    <Paper className={classes.column} elevation={0}>
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
