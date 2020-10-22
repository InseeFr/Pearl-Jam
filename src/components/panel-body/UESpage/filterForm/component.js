import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { searchFilterByAttribute } from 'common-tools/functions';
import D from 'i18n';
import './filterForm.scss';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import toDoEnum from 'common-tools/enum/SUToDoEnum';

const Form = ({ closeModal, filters, updateFilters }) => {
  const [campaignFilter, setCampaignFilter] = useState(
    searchFilterByAttribute(filters, 'campaign')
  );
  const [sampleFilter, setSampleFilter] = useState(searchFilterByAttribute(filters, 'sample'));
  const [cityNameFilter, setCityNameFilter] = useState(
    searchFilterByAttribute(filters, 'cityName')
  );
  const [toDoFilter, setToDoFilter] = useState(searchFilterByAttribute(filters, 'toDo'));
  const [priorityFilter, setPriorityFilter] = useState(
    searchFilterByAttribute(filters, 'priority')
  );

  const [campaignList, setCampaignList] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [cityNameList, setCityNameList] = useState([]);
  const [toDoList, setToDoList] = useState([]);

  useEffect(() => {
    const campaignSet = new Set();
    const sampleSet = new Set();
    const cityNameSet = new Set();
    surveyUnitDBService.getAll().then(units => {
      units.forEach(unit => {
        campaignSet.add(unit.campaign);
        sampleSet.add(unit.sampleIdentifiers.ssech);
        cityNameSet.add(
          unit.address.l6
            .split(' ')
            .slice(1)
            .toString()
        );
      });

      setCampaignList(Array.from(campaignSet.values()));

      setSampleList(Array.from(sampleSet.values()));

      setCityNameList(Array.from(cityNameSet.values()));
    });

    setToDoList(Array.from(Object.values(toDoEnum)));
  }, []);

  const newFilters = () => {
    return [campaignFilter, sampleFilter, cityNameFilter, toDoFilter, priorityFilter];
  };

  const updateCampaignFilter = event => {
    const { value } = event.target;
    setCampaignFilter({ ...campaignFilter, value });
  };
  const updateSampleFilter = event => {
    const { value } = event.target;
    setSampleFilter({ ...sampleFilter, value });
  };
  const updateCityNameFilter = event => {
    const { value } = event.target;
    setCityNameFilter({ ...cityNameFilter, value });
  };
  const updateToDoFilter = event => {
    const { value } = event.target;
    setToDoFilter({ ...toDoFilter, value });
  };
  const updatePriorityFilter = event => {
    const { checked } = event.target;
    setPriorityFilter({ ...priorityFilter, value: checked });
  };

  const save = () => {
    updateFilters(newFilters());
    closeModal();
  };

  const generateOptions = list => {
    return list.map(element => {
      return (
        <option
          value={element.order !== undefined ? element.order : element}
          key={element.order !== undefined ? element.order : element}
        >
          {element.value !== undefined ? element.value : element}
        </option>
      );
    });
  };

  return (
    <>
      <label htmlFor="campaignFilter">
        <div className="filter-label">{D.surveyFilter}</div>
        <select
          type="list"
          id="campaignFilter"
          name="campaignFilter"
          onChange={e => updateCampaignFilter(e)}
          value={campaignFilter.value !== undefined ? campaignFilter.value : 'placeholder'}
          required
        >
          <option disabled hidden value="placeholder">
            {D.chooseAnOption}
          </option>
          {generateOptions(campaignList)}
        </select>
      </label>
      <label htmlFor="sampleFilter">
        <div className="filter-label">{D.sampleFilter}</div>
        <select
          type="list"
          id="sampleFilter"
          name="sampleFilter"
          onChange={e => updateSampleFilter(e)}
          value={sampleFilter.value !== undefined ? sampleFilter.value : 'placeholder'}
          required
        >
          <option disabled hidden value="placeholder">
            {D.chooseAnOption}
          </option>
          {generateOptions(sampleList)}
        </select>
      </label>

      <label htmlFor="cityNameFilter">
        <div className="filter-label">{D.cityNameFilter}</div>
        <select
          type="list"
          id="cityNameFilter"
          name="cityNameFilter"
          onChange={e => updateCityNameFilter(e)}
          value={cityNameFilter.value !== undefined ? cityNameFilter.value : 'placeholder'}
          required
        >
          <option disabled hidden value="placeholder">
            {D.chooseAnOption}
          </option>
          {generateOptions(cityNameList)}
        </select>
      </label>
      <label htmlFor="toDoFilter">
        <div className="filter-label">{D.toDoFilter}</div>
        <select
          type="list"
          id="toDoFilter"
          name="toDoFilter"
          onChange={e => {
            e.persist();
            updateToDoFilter(e);
          }}
          value={toDoFilter.value !== undefined ? toDoFilter.value : 'placeholder'}
          required
        >
          <option disabled hidden value="placeholder">
            {D.chooseAnOption}
          </option>
          {generateOptions(toDoList)}
        </select>
      </label>
      <label htmlFor="priorityFilter">
        <div className="filter-label">{D.priorityFilter}</div>
        <div className="switch">
          <input
            type="checkbox"
            id="priorityFilter"
            name="priorityFilter"
            defaultChecked={priorityFilter.value}
            onClick={e => {
              e.persist();
              updatePriorityFilter(e);
            }}
          />
          <span className="slider round" />
        </div>
      </label>

      <button type="button" onClick={() => save()}>
        <i className="fa fa-check" aria-hidden="true" />
        {` ${D.validateButton}`}
      </button>
      <button type="button" onClick={() => closeModal()}>
        <i className="fa fa-times" aria-hidden="true" />
        {` ${D.closeButton}`}
      </button>
    </>
  );
};

export default Form;
Form.propTypes = {
  closeModal: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateFilters: PropTypes.func.isRequired,
};
