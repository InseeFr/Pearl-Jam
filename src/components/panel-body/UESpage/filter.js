import React from 'react';
import PropTypes from 'prop-types';
import './filter.scss';

const Filter = ({ filters, removeFilter }) => {
  // TODO function to map filters and create divs with onclick removeFilter(attribute)

  const returnFilters = () => {
    return filters
      .filter(filter => filter.value !== undefined)
      .map(filter => {
        // const label =

        return (
          <div
            className="filter"
            key={filter.attribute}
            onClick={() => removeFilter(filter.attribute)}
            role="button"
            onKeyPress={() => {}}
            tabIndex="0"
          >
            <span>{filter.attribute}</span>
            <span>{filter.value}</span>
          </div>
        );
      });
  };
  return <>{returnFilters()}</>;
};

export default Filter;

Filter.propTypes = {
  removeFilter: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      attribute: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ).isRequired,
};
