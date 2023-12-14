import InputBase from '@material-ui/core/InputBase';
import InputAdornment from '@material-ui/core/InputAdornment';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  searchLogo: {
    marginLeft:"0.5em"
  },
  search: {
    marginTop:"0.5em",
    backgroundColor: theme.palette.primary.main,
    borderRadius:"2em",
    margin:'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: '90%',
    },
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    borderRadius:"2em",
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
      placeholder="Nom, prénom, enquête, ID..."
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{
        'aria-label': 'search',
      }}
      startAdornment={
        <SearchIcon className={classes.searchLogo} />
      }
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
