import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const SearchBar = ({ textSearch, setTextSearch }) => {
  const handleChange = e => {
    const txt = e.target.value;
    setTextSearch(txt);
  };

  const useStyles = makeStyles(theme => ({
    search: {
      position: 'relative',
      marginRight: theme.spacing(2),
      marginLeft: 0,
      height: '2em',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: '75%',
      },
    },

    inputRoot: {
      color: 'inherit',
      height: '2em',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `1em`,
      // backgroundColor: theme.color.backgroundColor,
      border: 'solid 1px black',
      color: 'black',
      marginRight: '1em',
    },
  }));
  const classes = useStyles();

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
