import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  applyFilters,
  sortOnColumnCompareFunction,
  updateStateWithDates,
} from 'common-tools/functions';
import surveyUnitDBService from 'indexedbb/services/surveyUnit-idb-service';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import FilterPanel from './filterPanel';
import SurveyUnitCard from './material/surveyUnitCard';

const UESPage = ({ textSearch }) => {
  const [surveyUnits, setSurveyUnits] = useState([]);
  const [filteredSurveyUnits, setFilteredSurveyUnits] = useState([]);
  const [searchEchoes, setSearchEchoes] = useState([0, 0]);
  const [campaigns, setCampaigns] = useState([]);
  const [init, setInit] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('remainingDays');
  const [filters, setFilters] = useState({
    search: textSearch,
    campaigns: [],
    toDos: [],
    priority: false,
    terminated: false,
  });

  useEffect(() => {
    if (!init) {
      setInit(true);
      surveyUnitDBService.getAll().then(units => {
        const initializedSU = units.map(su => ({ ...su, selected: false }));
        setCampaigns([...new Set(units.map(unit => unit.campaign))]);
        setSurveyUnits(initializedSU);
        setSearchEchoes([initializedSU.length, initializedSU.length]);
      });
    }
  }, [init]);

  useEffect(() => {
    setFilters(f => ({ ...f, search: textSearch }));
  }, [textSearch]);

  useEffect(() => {
    surveyUnitDBService.getAll().then(units => {
      const updateNb = units.map(su => updateStateWithDates(su)).reduce((a, b) => a + b, 0);
      if (updateNb > 0) setInit(false);
    });
  }, [surveyUnits]);

  useEffect(() => {
    const sortSU = su => su.sort(sortOnColumnCompareFunction(sortCriteria));
    const filteredSU = applyFilters(surveyUnits, filters);

    const { searchFilteredSU, totalEchoes, matchingEchoes } = filteredSU;
    setFilteredSurveyUnits(sortSU(searchFilteredSU));
    setSearchEchoes([matchingEchoes, totalEchoes]);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [textSearch, filters, sortCriteria, surveyUnits]);

  const useStyles = makeStyles(() => ({
    root: {
      height: 'calc(100vh - 5em)',
      scrollbarWidth: 'none',
    },
    grid: {
      height: '100%',
      width: 'calc(100vw - 200px)',
      overflow: 'auto',
      scrollbarWidth: 'none',
      padding: 10,
      '&:last-child': {
        paddingBottom: 0,
      },
      paddingTop: 0,
      alignContent: 'flex-start',
    },
  }));
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.root} spacing={0}>
        <FilterPanel
          searchEchoes={searchEchoes}
          campaigns={campaigns}
          sortCriteria={sortCriteria}
          setSortCriteria={setSortCriteria}
          filters={filters}
          setFilters={setFilters}
        />
        <Grid container className={classes.grid} spacing={4}>
          {filteredSurveyUnits.map(su => (
            <Grid key={su.id} item>
              <SurveyUnitCard surveyUnit={su} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};

export default UESPage;
UESPage.propTypes = {
  textSearch: PropTypes.string.isRequired,
};
