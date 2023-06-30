import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Individual } from './Individual';
import PropTypes from 'prop-types';
import React from 'react';
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

const Contact = ({ persons }) => {
  const classes = useStyles();

  return (
    <Grid container>
      {persons.map((person, index) => {
        return (
          <React.Fragment key={`person-${person.id}`}>
            {index > 0 && (
              <Divider
                key={`splitter`}
                orientation="vertical"
                flexItem
                className={classes.spaceAround}
              />
            )}
            <Individual person={person} />
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default Contact;
Contact.propTypes = {
  persons: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
