import { IconButton, makeStyles } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useCounter from 'common-tools/hooks/useCounter';
import { getHours, getMinutes, setHours, setMinutes } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: '1.5em',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const UpDownCounter = ({ selectedDate, handleDateChange, type }) => {
  const classes = useStyles();

  const isHours = type === 'hours';
  const getData = () => (isHours ? getHours(selectedDate) : getMinutes(selectedDate));

  const counterParams = {
    initialValue: getData(),
    interval: isHours ? 13 : 10,
    deltaValue: isHours ? 2 : 5,
  };
  const {
    counter: { current: counter },
    startAdd,
    startRemove,
    stop,
  } = useCounter(counterParams);
  //* keep value in [min-max] range to prevent hour/day leap

  const clean = value => (isHours ? (value + 24) % 24 : (value + 60) % 60);
  const setData = value => {
    const cleanedValue = clean(value);
    return isHours ? setHours(selectedDate, cleanedValue) : setMinutes(selectedDate, cleanedValue);
  };
  useEffect(() => {
    handleDateChange(setData(counter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter, handleDateChange, isHours]);

  return (
    <div className={classes.column}>
      <IconButton
        onMouseDown={startAdd}
        onTouchStart={startAdd}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchEnd={stop}
      >
        <ExpandLessIcon className={classes.icon} />
      </IconButton>
      {getData()
        .toString()
        .padStart(2, '0')}
      <IconButton
        onMouseDown={startRemove}
        onTouchStart={startRemove}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchEnd={stop}
      >
        <ExpandMoreIcon className={classes.icon} />
      </IconButton>
    </div>
  );
};

export default UpDownCounter;
UpDownCounter.propTypes = {
  selectedDate: PropTypes.shape({}).isRequired,
  handleDateChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};
