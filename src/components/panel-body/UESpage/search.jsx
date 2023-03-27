import React, { useState } from 'react';
import D from 'i18n';

const Search = ({ setFilter }) => {
  const [motFilter, setMotFilter] = useState('');

  const updateFilter = () => {
    setFilter(motFilter.toLowerCase());
  };
  const handleKeyUp = e => {
    if (e.key === 'Enter') {
      updateFilter();
    }
  };

  const handleChange = e => {
    const txt = e.target.value;
    setMotFilter(txt);
    // uncomment the next line to apply the filter as soon as you enter a letter in the input.
    //setFilter(txt.toLowerCase());
  };

  return (
    <>
      <input
        type="inputtext"
        placeholder={`${D.search}`}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />
      <button className="rechercher" type="button" onClick={updateFilter}>
        <i className="fa fa-search" />
      </button>
    </>
  );
};

export default Search;
