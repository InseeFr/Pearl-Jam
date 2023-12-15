import React, { useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Checkbox from '@material-ui/core/Checkbox';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { toDoEnum } from 'utils/enum/SUToDoEnum';
import D from 'i18n';
import PropTypes from 'prop-types';

const FilterPanel = ({
  searchEchoes,
  campaigns,
  sortCriteria,
  setSortCriteria,
  filters,
  setFilters,
}) => {
  const colorMapping = {
    1: '#FFC9D5',
    2: '#F8E4A5',
    3: '#E9C09C',
    4: '#B7A1C8',
    5: '#A5BCDB',
    6: '#9AE3AB',
  };
  const useStyles = makeStyles(() => ({
    ...Object.keys(colorMapping).reduce((acc, order) => {
      acc[`customLabelOrder${order}`] = {
        backgroundColor: colorMapping[order],
        borderRadius: '0.5em',
        padding: '0.05em 0.6em 0.05em 0.6em',
        margin: '0.2em',
        fontSize: '14px',
        color: '#0A192E',
      };
      return acc;
    }, {}),
    labelPlacementStart: {
      marginLeft: 0,
    },
    switchLabel: {
      fontSize: '0.7rem',
      fontWeight: 'bold',
    },
    switch: {
      transform: 'scale(0.8)',
      '& .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#52CF6F',
      },
    },
    leftMargin: { marginLeft: '16px' },
    drawer: {
      height: '100%',
      width: 300,
      margin: '1em',
      zIndex: 100,
    },
    drawerPaper: {
      position: 'relative',
      borderRadius: '2em',
    },
    drawerContainer: {
      overflow: 'auto',
      height: '100%',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    paddingFour: {
      padding: 4,
    },
    customAccordionSummary: {
      '&.Mui-expanded': {
        margin: '0px',
        '& > .MuiAccordionSummary-content': {
          margin: '0px',
        },
      },
    },
    heading: {
      fontSize: '14px',
    },
    accordionDetailsVertical: {
      flexDirection: 'column',
    },
    customAccordionDetails: {
      padding: '0px 16px 16px',
    },
    formControlLabel: {
      '& .MuiFormControlLabel-label': {
        fontSize: '14px',
      },
    },
    accordion: { '&.MuiAccordion-root.Mui-expanded': { margin: '0px' } },
    accordionSummary: { '&.MuiAccordionSummary-root.Mui-expanded': { minHeight: '0px' } },
    typoTitle: {
      margin: '1rem 1rem 0rem 1rem',
      fontWeight: 'bold',
    },
  }));

  const classes = useStyles();

  const [sortCriteriaExpanded, setSortCriteriaExpanded] = useState(true);

  const [campaignFilterExpanded, setCampaignFilterExpanded] = useState(true);

  const [priorityFilterExpanded, setPriorityFilterExpanded] = useState(true);

  const [terminatedFilterExpanded, setTerminatedFilterExpanded] = useState(true);

  const [toDoFilterExpanded, setToDoFilterExpanded] = useState(true);

  const [subSampleFilterExpanded, setSubSampleFilterExpanded] = useState(true);
  const [selectedSubSample, setSelectedSubSample] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');

  const handleSubSampleChange = event => {
    setSelectedSubSample(event.target.value);
  };

  const handleClusterChange = event => {
    setSelectedCluster(event.target.value);
  };

  const setPriority = value => {
    setFilters({ ...filters, priority: value });
  };

  const setSelectedCampaigns = array => {
    setFilters({ ...filters, campaigns: array });
  };

  const setSelectedTodos = array => {
    setFilters({ ...filters, toDos: array, terminated: false });
  };

  const setTerminated = value => {
    if (value) {
      setFilters({ ...filters, terminated: value, toDos: [toDoEnum.TERMINATED.order.toString()] });
    } else {
      setFilters({ ...filters, terminated: value, toDos: [] });
    }
  };

  const { campaigns: selectedCampaigns, toDos: selectedToDos, priority, terminated } = filters;

  const toggleCampaignSelection = value => {
    if (!selectedCampaigns.includes(value)) {
      setSelectedCampaigns([...selectedCampaigns, value]);
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(c => c !== value));
    }
  };

  const toggleToDoSelection = value => {
    if (!selectedToDos.includes(value)) {
      setSelectedTodos([...selectedToDos, value].filter(c => c !== '7'));
    } else {
      setSelectedTodos(selectedToDos.filter(c => c !== value));
    }
  };

  const handleChange = panel => (event, isExpanded) => {
    switch (panel) {
      case 'sortAccordion':
        setSortCriteriaExpanded(isExpanded);
        break;
      case 'campaignFilterAccordion':
        setCampaignFilterExpanded(isExpanded);
        break;
      case 'priorityFilterAccordion':
        setPriorityFilterExpanded(isExpanded);
        break;
      case 'terminatedFilterAccordion':
        setTerminatedFilterExpanded(isExpanded);
        break;
      case 'toDoFilterAccordion':
        setToDoFilterExpanded(isExpanded);
        break;
      case 'campaignCheckbox':
        toggleCampaignSelection(event.target.name);
        break;
      case 'toDoCheckbox':
        toggleToDoSelection(event.target.name);
        break;
      case 'priority':
        setPriority(event.target.checked);
        break;
      case 'terminated':
        setTerminated(event.target.checked);
        break;

      default:
        break;
    }
  };

  const changeCriteria = event => {
    const {
      target: { value },
    } = event;
    setSortCriteria(value === sortCriteria ? '' : value);
  };

  const toDoEnumValues = Object.values(toDoEnum)
    .reduce((tab, value) => [...tab, value], [])
    .filter(todo => todo.order < 7);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <Typography className={classes.typoTitle}>Filtrer les unités par</Typography>
        <Accordion
          className={classes.accordion}
          expanded={campaignFilterExpanded}
          onChange={handleChange('campaignFilterAccordion')}
        >
          <AccordionSummary
            className={`${classes.accordionSummary} ${classes.customAccordionSummary}`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="campaignFilterAccordion-header"
          >
            <Typography className={classes.heading}>{D.sortSurvey}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.customAccordionDetails}>
            <FormGroup>
              {campaigns.map(campaign => (
                <FormControlLabel
                  key={campaign}
                  className={classes.formControlLabel}
                  control={
                    // eslint-disable-next-line react/jsx-wrap-multilines
                    <Checkbox
                      className={classes.paddingFour}
                      checked={selectedCampaigns.includes(campaign)}
                      onChange={handleChange('campaignCheckbox')}
                      name={campaign}
                    />
                  }
                  label={campaign.toLowerCase()}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion
          className={classes.accordion}
          expanded={priorityFilterExpanded}
          onChange={handleChange('priorityFilterAccordion')}
        >
          <AccordionSummary
            className={`${classes.accordionSummary} ${classes.customAccordionSummary}`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="priorityFilterAccordion-header"
          >
            <Typography className={classes.heading}>{D.priority}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.customAccordionDetails}>
            <FormGroup>
              <FormControlLabel
                key={priority}
                className={classes.formControlLabel}
                control={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <Checkbox
                    className={classes.paddingFour}
                    checked={priority}
                    onChange={handleChange('priority')}
                    name="priority"
                  />
                }
                label="Unités prioritaires"
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={toDoFilterExpanded}
          onChange={handleChange('toDoFilterAccordion')}
          className={classes.accordion}
        >
          <AccordionSummary
            className={`${classes.accordionSummary} ${classes.customAccordionSummary}`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="toDoFilterAccordion-header"
          >
            <Typography className={classes.heading}>{D.sortStatus}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.customAccordionDetails}>
            <FormGroup>
              <FormControlLabel
                key={terminated}
                labelPlacement="start"
                classes={{ labelPlacementStart: classes.labelPlacementStart }}
                control={
                  <Switch
                    checked={terminated}
                    onChange={handleChange('terminated')}
                    name="terminated"
                    color="primary"
                    className={classes.switch}
                  />
                }
                label={
                  <Typography className={classes.switchLabel}>
                    Masquer les unités terminées
                  </Typography>
                }
              />
              {toDoEnumValues.map(todo => (
                <FormControlLabel
                  key={todo.order}
                  classes={{ label: classes[`customLabelOrder${todo.order}`] }}
                  control={
                    <Checkbox
                      className={classes.paddingFour}
                      checked={selectedToDos.includes(todo.order.toString())}
                      onChange={handleChange('toDoCheckbox')}
                      name={todo.order.toString()}
                    />
                  }
                  label={todo.value}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={subSampleFilterExpanded}
          onChange={() => setSubSampleFilterExpanded(!subSampleFilterExpanded)}
          className={classes.accordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="subSampleFilter-content"
            id="subSampleFilter-header"
          >
            <Typography className={classes.heading}>Sous-échantillon et grappe</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetailsVertical}>
            <FormControl fullWidth>
              <InputLabel id="subSample-select-label">Sous-échantillon...</InputLabel>
              <Select
                labelId="subSample-select-label"
                id="subSample-select"
                value={selectedSubSample}
                onChange={handleSubSampleChange}
              >
                {/* Options pour le select "Sous-échantillon" */}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="cluster-select-label">Grappe...</InputLabel>
              <Select
                labelId="cluster-select-label"
                id="cluster-select"
                value={selectedCluster}
                onChange={handleClusterChange}
              >
                {/* Options pour le select "Grappe" */}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </div>
    </Drawer>
  );
};

export default FilterPanel;
FilterPanel.propTypes = {
  searchEchoes: PropTypes.arrayOf(PropTypes.number).isRequired,
  campaigns: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortCriteria: PropTypes.string.isRequired,
  setSortCriteria: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    campaigns: PropTypes.arrayOf(PropTypes.string).isRequired,
    toDos: PropTypes.arrayOf(PropTypes.string).isRequired,
    priority: PropTypes.bool.isRequired,
    terminated: PropTypes.bool.isRequired,
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
};
