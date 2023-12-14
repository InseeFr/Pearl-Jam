import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { applyFilters, sortOnColumnCompareFunction, updateStateWithDates } from 'utils/functions';
import { useMissingSurveyUnits, useSurveyUnits } from 'utils/hooks/database';
import FilterPanel from './filterPanel';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import SurveyUnitCard from './material/surveyUnitCard';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, Select, Typography } from '@material-ui/core';
import SearchBar from 'components/common/search/component';
import D from 'i18n';

const UESPage = ({ textSearch, setTextSearch, setOpenDrawer }) => {
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

  const changeCriteria = event => {
    const {
      target: { value },
    } = event;
    setSortCriteria(value === sortCriteria ? '' : value);
  };

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
  const useStyles = makeStyles(theme => ({
    root: {
      height: 'calc(100vh - 5em)',
      scrollbarWidth: 'none',
      backgroundColor: '#F5F7FA',
    },
    grid: {
      height: '100%',
      width: 'calc(100vw - 300px)',
      overflow: 'auto',
      scrollbarWidth: 'none',
      padding: 10,
      '&:last-child': {
        paddingBottom: 0,
      },
      paddingTop: 0,
      alignContent: 'flex-start',
      marginTop: '0.5em',
    },
    grow: {
      flex: '1 1 auto',
      width: '100%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 220,
      backgroundColor: 'white',
      borderRadius: '3em',
    },
    wrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      margin: '2em',
    },
    select: {
      display: 'flex',
    },
    typoFilter: {
      marginRight: '0.3em',
      alignSelf: 'center',
      fontWeight: 'bold',
    },
  }));
  const classes = useStyles();

  return (
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
        <div className={classes.grow}>
          <SearchBar textSearch={textSearch} setTextSearch={setTextSearch} />
        </div>
        <div className={classes.wrapper}>
          <div className={classes.leftMargin}>
            {`${searchEchoes[0]} ${D.surveyUnits} ${searchEchoes[1]}`}
          </div>
          <div className={classes.select}>
            <Typography className={classes.typoFilter}>Trier par:</Typography>
            <FormControl className={classes.formControl}>
              <Select
                disableUnderline
                labelId="sortCriteria-label"
                id="sortCriteria-select"
                value={sortCriteria}
                onChange={changeCriteria}
              >
                <MenuItem value="remainingDays">{D.remainingDays}</MenuItem>
                <MenuItem value="priority">{D.priority}</MenuItem>
                <MenuItem value="campaign">{D.survey}</MenuItem>
                <MenuItem value="sampleIdentifiers">{D.subSample}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {filteredSurveyUnits.map(su => (
          <Grid key={su.id} item>
            <SurveyUnitCard surveyUnit={su} inaccessible={inaccessibles.includes(su.id)} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default UESPage;
UESPage.propTypes = {
  textSearch: PropTypes.string.isRequired,
};
