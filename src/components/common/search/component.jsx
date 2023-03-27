import InputBase from '@material-ui/core/InputBase';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  search: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '75%',
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    border: 'solid 1px black',
  },
}));

const SearchBar = ({ textSearch, setTextSearch }) => {
  const classes = useStyles();
  const handleChange = e => {
    const txt = e.target.value;
    setTextSearch(txt);
  };

  return (
    <InputBase
      className={classes.search}
      placeholder="Nom, prénom, enquête, ..."
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{
        'aria-label': 'search',
      }}
      onChange={handleChange}
      value={textSearch}
    />
  );
};

export default SearchBar;
SearchBar.propTypes = {
  textSearch: PropTypes.string.isRequired,
  setTextSearch: PropTypes.func.isRequired,
};
