import React, { useState, useEffect } from 'react';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import D from 'i18n';
import Modal from 'react-modal';
import suStateEnum from 'common-tools/enum/SUStateEnum';
import {
  isValidForTransmission,
  addNewState,
  sortOnColumnCompareFunction,
  applyFilters,
  searchFilterByAttribute,
  updateStateWithDates,
} from 'common-tools/functions';
import Form from './transmitForm';
import FilterForm from './filterForm';
import PageList from './pageList';
import Search from './search';
import Filter from './filter';
import './ues.scss';

const UESPage = () => {
  const [surveyUnits, setSurveyUnits] = useState([]);
  const [filteredSurveyUnits, setFilteredSurveyUnits] = useState([]);
  const [searchEchoes, setSearchEchoes] = useState([0, 0]);
  const [init, setInit] = useState(false);
  const [showTransmitSummary, setShowTransmitSummary] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [transmitSummary, setTransmitSummary] = useState({ ok: 0, ko: 0 });
  const [columnOrder, setColumnOrder] = useState(undefined);
  const [filters, setFilters] = useState([
    { attribute: 'search', value: undefined },
    { attribute: 'campaign', value: undefined },
    { attribute: 'sample', value: undefined },
    { attribute: 'cityName', value: undefined },
    { attribute: 'toDo', value: undefined },
    { attribute: 'priority', value: undefined },
  ]);

  useEffect(() => {
    if (!init) {
      setInit(true);
      surveyUnitDBService.getAll().then(units => {
        const initializedSU = units.map(su => {
          return { ...su, selected: false };
        });
        setSurveyUnits(initializedSU);
        setSearchEchoes([initializedSU.length, initializedSU.length]);
      });
    }
  }, [init]);

  useEffect(() => {
    surveyUnitDBService.getAll().then(units => {
      const updateNb = units
        .map(su => {
          return updateStateWithDates(su);
        })
        .reduce((a, b) => a + b, 0);
      if (updateNb > 0) setInit(false);
    });
  }, [surveyUnits]);

  useEffect(() => {
    const sortSU = su => {
      return su.sort(sortOnColumnCompareFunction(columnOrder));
    };

    const filteredSU = applyFilters(surveyUnits, filters);

    const { searchFilteredSU, totalEchoes, matchingEchoes } = filteredSU;
    setFilteredSurveyUnits(sortSU(searchFilteredSU));
    setSearchEchoes([matchingEchoes, totalEchoes]);
  }, [filters, columnOrder, surveyUnits]);

  const isSelectable = su => {
    // TODO implements rules (collection[Start|End]Date)
    return true;
  };

  const sortOnColumn = column => {
    if (columnOrder === undefined || columnOrder.column !== column) {
      setColumnOrder({ column, order: 'ASC' });
    } else if (columnOrder.order === 'ASC') {
      setColumnOrder({ column, order: 'DESC' });
    } else {
      setColumnOrder(undefined);
    }
  };

  const toggleAllSUSelection = newValue => {
    setSurveyUnits(
      surveyUnits.map(su => {
        const selectable = isSelectable(su);
        return { ...su, selected: selectable ? newValue : false };
      })
    );
  };

  const toggleOneSUSelection = (id, newValue) => {
    setSurveyUnits(
      surveyUnits.map(su => {
        if (su.id === id) {
          return { ...su, selected: newValue };
        }
        return su;
      })
    );
  };

  const processSU = async surveyUnitsToProcess => {
    const newType = suStateEnum.WAITING_FOR_SYNCHRONIZATION.type;
    let nbOk = 0;
    let nbKo = 0;

    surveyUnitsToProcess.forEach(su => {
      if (su.valid) {
        addNewState(su, newType);
        nbOk += 1;
      } else {
        nbKo += 1;
      }
    });

    setSurveyUnits(await surveyUnitDBService.getAll());
    setTransmitSummary({ ok: nbOk, ko: nbKo });
  };

  const transmit = async () => {
    const filteredSU = surveyUnits
      .filter(su => su.selected)
      .map(su => {
        return { ...su, valid: isValidForTransmission(su) };
      });
    await processSU(filteredSU);
    setShowTransmitSummary(true);
    setInit(false);
  };

  const closeModal = () => {
    setShowTransmitSummary(false);
  };

  const closeFilterPanel = () => {
    setShowFilterPanel(false);
  };

  const anySuSelected = surveyUnits.filter(su => su.selected).length > 0 ? '' : '"disabled"';

  const updateSearchFilter = searchedString => {
    // setSearchFilter(searchedString);
    const newFilters = filters.map(filter => {
      if (filter.attribute === 'search') {
        const newFilter = filter;
        newFilter.value = searchedString;
        return newFilter;
      }
      return filter;
    });
    setFilters(newFilters);
  };

  const transmitButton = () => {
    return (
      <button type="button" className="transmit" disabled={anySuSelected} onClick={transmit}>
        <i className="fa fa-paper-plane" aria-hidden="true" />
        &nbsp;Transmettre
      </button>
    );
  };

  const getSearchFilterValue = () => {
    if (filters === undefined) return '';
    const searchFilter = filters.filter(filter => filter.attribute === 'search');
    if (searchFilter.length === 0) {
      return '';
    }
    return searchFilter.value;
  };

  const removeFilter = attribute => {
    const newFilters = filters.map(filter => {
      if (filter.attribute === attribute) {
        return { attribute, value: undefined };
      }
      return filter;
    });
    setFilters(newFilters);
  };

  const updateFilters = newFilters => {
    const updatedFilters = filters.map(filter => {
      const newFilter = searchFilterByAttribute(newFilters, filter.attribute);
      if (newFilter !== undefined) {
        const updatedFilter = filter;
        updatedFilter.value = newFilter.value;
        console.log('updatedFilter : ', updatedFilter);
        return updatedFilter;
      }

      return filter;
    });
    setFilters(updatedFilters);
  };

  return (
    <div className="panel-body ues">
      <div className="column">
        <div className="filters">
          <div className="button-ue">
            <button
              className="ShowAll"
              type="button"
              onClick={() => {
                updateSearchFilter('');
                setColumnOrder(undefined);
              }}
            >
              <i className="fa fa-bars" aria-hidden="true" />
              &nbsp;
              {D.showAll}
            </button>
            <Filter filters={filters} removeFilter={removeFilter} />
            {getSearchFilterValue() && (
              <div className="searchedString">
                {`${D.activeFilter} : ${getSearchFilterValue()}`}
              </div>
            )}
            <Search setFilter={updateSearchFilter} />
            <button type="button" onClick={() => setShowFilterPanel(true)}>
              Filtrer
            </button>
          </div>
        </div>
        <div className="searchResults">{`Résultat : ${searchEchoes[0]} / ${searchEchoes[1]} unités`}</div>
      </div>
      <PageList
        surveyUnits={filteredSurveyUnits}
        toggleAllSUSelection={toggleAllSUSelection}
        toggleOneSUSelection={toggleOneSUSelection}
        transmitButton={transmitButton}
        sortOnColumn={sortOnColumn}
        columnFilter={columnOrder}
      />

      <Modal isOpen={showFilterPanel} onRequestClose={closeFilterPanel} className="modal">
        <FilterForm
          closeModal={closeFilterPanel}
          filters={filters}
          setFilters={setFilters}
          updateFilters={updateFilters}
        />
      </Modal>

      <Modal isOpen={showTransmitSummary} onRequestClose={closeModal} className="modal">
        <Form closeModal={closeModal} summary={transmitSummary} />
      </Modal>
    </div>
  );
};

export default UESPage;
