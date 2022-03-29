import React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { sortPhoneNumbers } from 'utils/functions';
import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import PhoneList from './phoneList';

const useStyles = makeStyles(() => ({
  root: {
    padding: 8,
    borderRadius: 15,
    border: ' LightGray solid 1px',
    minHeight: 130,
    width: 'max-content',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  },
  clickable: {
    '&:hover': { cursor: 'pointer' },
  },
  firstLine: {
    alignSelf: 'flex-end',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: { fontWeight: 'bold', marginRight: '0.5em' },
}));

const PhoneTile = ({
  phoneNumbers,
  onClickFunction = () => {},
  toggleFavoritePhone = () => {},
  editionMode = false,
  updatePhoneNumber = () => {},
  deletePhoneNumber = () => {},
}) => {
  const classes = useStyles();
  const { fiscalPhoneNumbers, directoryPhoneNumbers, interviewerPhoneNumbers } = sortPhoneNumbers(
    phoneNumbers
  );

  return (
    <Paper
      className={`${classes.root} ${editionMode ? '' : classes.clickable}`}
      onClick={() => onClickFunction()}
      variant="outlined"
    >
      <div className={classes.firstLine}>
        <MaterialIcons type="phone" />
      </div>
      <div className={classes.row}>
        <PhoneList
          numbers={fiscalPhoneNumbers}
          type="FISCAL"
          toggleFavoritePhone={toggleFavoritePhone}
        />
        <PhoneList
          numbers={directoryPhoneNumbers}
          type="DIRECTORY"
          toggleFavoritePhone={toggleFavoritePhone}
        />
        <PhoneList
          numbers={interviewerPhoneNumbers}
          type="INTERVIEWER"
          editable={editionMode}
          toggleFavoritePhone={toggleFavoritePhone}
          updatePhoneNumber={updatePhoneNumber}
          deletePhoneNumber={deletePhoneNumber}
        />
      </div>
    </Paper>
  );
};

export default PhoneTile;
PhoneTile.propTypes = {
  phoneNumbers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onClickFunction: PropTypes.func,
  editionMode: PropTypes.bool,
  toggleFavoritePhone: PropTypes.func,
  updatePhoneNumber: PropTypes.func,
  deletePhoneNumber: PropTypes.func,
};
