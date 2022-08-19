import AtomicInfoTile from '../atomicInfoTile';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MaterialIcons from 'utils/icons/materialIcons';
import PropTypes from 'prop-types';
import React from 'react';
import formEnum from 'utils/enum/formEnum';
import { getUserData } from 'utils/functions';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  spaceAround: {
    marginLeft: '1em',
    marginRight: '1em',
  },
  centered: {
    justifySelf: 'center',
    width: 'max-content',
    margin: 'auto',
  },
  flex: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Contact = ({ persons, selectFormType, setInjectableData }) => {
  const classes = useStyles();

  return (
    <Grid container>
      {persons.map((person, index) => {
        return (
          <>
            {index > 0 && (
              <Divider orientation="vertical" flexItem className={classes.spaceAround} />
            )}
            <div className={classes.flex}>
              <AtomicInfoTile key="user" data={getUserData(person)} />
              <MaterialIcons
                type="pen"
                onClick={() => {
                  selectFormType(formEnum.USER, true);
                  setInjectableData(person);
                }}
              />
            </div>
          </>
        );
      })}
    </Grid>
  );
};

export default Contact;
Contact.propTypes = {
  selectFormType: PropTypes.func.isRequired,
  setInjectableData: PropTypes.func.isRequired,
  person: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
};
