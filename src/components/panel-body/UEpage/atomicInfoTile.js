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
}));

const AtomicInfoTile = ({ data }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={0}>
      {data.map(({ label, value }) => {
        switch (typeof value) {
          case 'boolean':
            return <LabelledBoolean labelText={label} value={value} />;
          default:
            return <LabelledText labelText={label} text={value} />;
        }
      })}
    </Paper>
  );
};

export default AtomicInfoTile;
AtomicInfoTile.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }))
    .isRequired,
};
