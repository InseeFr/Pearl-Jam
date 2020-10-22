import React from 'react';
import PropTypes from 'prop-types';
import D from 'i18n';
import toDoEnum from 'common-tools/enum/SUToDoEnum';
import './filter.scss';

const Filter = ({ filters, removeFilter }) => {
  const getFilterLabel = attribute => {
    switch (attribute) {
      case 'search':
        return D.searchFilter;
      case 'campaign':
        return D.surveyFilter;
      case 'priority':
        return D.priorityFilter;
      case 'cityName':
        return D.cityNameFilter;
      case 'toDo':
        return D.toDoFilter;
      case 'sample':
        return D.sampleFilter;

      default:
        break;
    }
    return 'ERR';
  };

  const getEnumValue = value => {
    const array = Object.values(toDoEnum);
    const filtered = array.filter(entry => entry.order.toString() === value.toString());
    return filtered[0].value;
  };

  const getFilterValue = filter => {
    const { attribute, value } = filter;
    let returnedValue = value;
    switch (attribute) {
      case 'search':
      case 'campaign':
      case 'cityName':
      case 'sample':
        break;
      case 'priority':
        returnedValue = value ? 'Oui' : 'Non';
        break;
      case 'toDo':
        returnedValue = getEnumValue(value);
        break;
      default:
        break;
    }
    return returnedValue;
  };

  const returnFilters = () => {
    return filters
      .filter(filter => filter.value !== undefined)
      .map(filter => {
        return (
          <div
            className="filter"
            key={filter.attribute}
            onClick={() => removeFilter(filter.attribute)}
            role="button"
            onKeyPress={() => {}}
            tabIndex="0"
          >
            <span>{getFilterLabel(filter.attribute)}</span>
            <span>{getFilterValue(filter)}</span>
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
