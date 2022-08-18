import React, { useEffect, useMemo } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  greyBackground: {
    backgroundColor: grey[200],
    marginTop: '3.5em',
    height: 'calc(100vh - 13.5em)',
  },
  appBar: { marginTop: '10em' },
}));

const generateTabs = tabsLabels =>
  tabsLabels.map((currentLabel, index) => (
    <Tab
      label={currentLabel}
      id={`full-width-tab-${index}`}
      aria-controls={`full-width-tabpanel-${index}`}
    />
  ));

const addPropsToTabPanels = (tabPanels, value, direction) =>
  React.Children.toArray(tabPanels).map((element, index) =>
    React.cloneElement(element, {
      ...element.props,
      hidden: value !== index,
      key: index,
      dir: { direction },
    })
  );
const TabSwipper = ({ tabsLabels, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [value, setValue] = React.useState(
    isNaN(parseInt(query.get('panel'))) || parseInt(query.get('panel')) === 'NaN'
      ? 0
      : parseInt(query.get('panel'))
  );

  const handleChange = (event, newValue) => {
    history.push(`${location.pathname.split('?')[0]}?panel=${newValue}`);
  };

  const handleChangeIndex = index => {
    history.push(`${location.pathname.split('?')[0]}?panel=${index}`);
  };
  useEffect(() => {
    setValue(parseInt(query.get('panel')));
  }, [location.search, query]);

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default" className={classes.appBar}>
        <Tabs
          value={value}
          onChange={handleChange}
          // indicatorColor="primary"
          textColor="secondary"
          variant="fullWidth"
          className={classes.root}
          aria-label="full width tabs example"
        >
          {generateTabs(tabsLabels)}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
        className={classes.greyBackground}
      >
        {addPropsToTabPanels(children, value, theme.direction)}
      </SwipeableViews>
    </div>
  );
};

export default TabSwipper;
