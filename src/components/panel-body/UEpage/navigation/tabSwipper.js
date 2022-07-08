import { makeStyles, useTheme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
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
      dir: { direction },
    })
  );
const TabSwipper = ({ tabsLabels, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {generateTabs(tabsLabels)}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {addPropsToTabPanels(children, value, theme.direction)}
      </SwipeableViews>
    </div>
  );
};

export default TabSwipper;
