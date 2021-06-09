import { TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getPhoneSource } from 'common-tools/functions';
import MaterialIcons from 'common-tools/icons/materialIcons';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 8,
    '&:hover': { cursor: 'pointer' },
    width: 'max-content',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
  },
  center: {
    alignSelf: 'center',
    color: theme.palette.text.secondary,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  label: { marginLeft: '0.5em' },
}));

const PhoneList = ({
  numbers,
  type,
  toggleFavoritePhone,
  editable = false,
  updatePhoneNumber = () => {},
  deletePhoneNumber = () => {},
}) => {
  const classes = useStyles();
  const isEditable = editable && type === 'INTERVIEWER';
  return (
    <div className={classes.root}>
      <Typography className={classes.center}>{getPhoneSource(type)}</Typography>
      {numbers.map((phoneNumber, index) => {
        return (
          <div key={phoneNumber.number} className={classes.row}>
            <MaterialIcons
              type={phoneNumber.favorite ? 'starFull' : 'starOutlined'}
              onClick={() => toggleFavoritePhone(phoneNumber)}
            />

            {isEditable ? (
              <>
                <TextField
                  margin="dense"
                  id={`phone-${index}`}
                  name={`phone-${index}`}
                  label={`#${index + 1}`}
                  InputLabelProps={{ color: 'secondary' }}
                  type="text"
                  fullWidth
                  defaultValue={phoneNumber.number}
                  onBlur={e => updatePhoneNumber(phoneNumber)(e)}
                  variant="outlined"
                />
                <MaterialIcons
                  type="delete"
                  onClick={() => deletePhoneNumber(phoneNumber.number)}
                />
              </>
            ) : (
              <Typography className={classes.label}>{phoneNumber.number}</Typography>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PhoneList;
PhoneList.propTypes = {
  toggleFavoritePhone: PropTypes.func.isRequired,
  numbers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  type: PropTypes.string.isRequired,
  editable: PropTypes.bool,
  updatePhoneNumber: PropTypes.func,
  deletePhoneNumber: PropTypes.func,
};
