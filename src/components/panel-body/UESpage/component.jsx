import React, { useEffect, useState } from 'react';
import { applyFilters, sortOnColumnCompareFunction, updateStateWithDates } from 'utils/functions';
import { useMissingSurveyUnits, useSurveyUnits } from 'utils/hooks/database';

import FilterPanel from './filterPanel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import SurveyUnitCard from './material/surveyUnitCard';
import { makeStyles } from '@material-ui/core/styles';

const UESPage = ({ textSearch }) => {
  const [surveyUnits, setSurveyUnits] = useState([]);
  const [filteredSurveyUnits, setFilteredSurveyUnits] = useState([]);
  const [searchEchoes, setSearchEchoes] = useState([0, 0]);
  const [campaigns, setCampaigns] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('remainingDays');
  const [filters, setFilters] = useState({
    search: textSearch,
    campaigns: [],
    toDos: [],
    priority: false,
    terminated: false,
  });

  const [inaccessibles, setInaccessibles] = useState([]);

  const missingSurveyUnits = useMissingSurveyUnits();
  const idbSurveyUnits = useSurveyUnits();

  useEffect(() => {
    setInaccessibles(missingSurveyUnits.map(({ id }) => id));
  }, [missingSurveyUnits]);

  useEffect(() => {
    idbSurveyUnits.forEach(su => updateStateWithDates(su));
  }, [idbSurveyUnits]);

  useEffect(() => {
    const initializedSU = idbSurveyUnits.map(su => ({ ...su, selected: false }));
    setCampaigns([...new Set(idbSurveyUnits.map(unit => unit.campaign))]);
    setSurveyUnits(initializedSU);
    setSearchEchoes([initializedSU.length, initializedSU.length]);
  }, [idbSurveyUnits]);

  useEffect(() => {
    setFilters(f => ({ ...f, search: textSearch }));
  }, [textSearch]);

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
              <SurveyUnitCard surveyUnit={su} inaccessible={inaccessibles.includes(su.id)} />
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
