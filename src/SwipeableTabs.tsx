import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Children, PropsWithChildren, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

export function SwipeableTab(props: Readonly<PropsWithChildren<{ index: number; label: string }>>) {
  const { children, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: 4 }}>{children}</Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export function SwipeableTabs({
  children,
}: Readonly<{ children: { props: { label: string } }[] }>) {
  const [value, setValue] = useState(0);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  const tabs = Children.map(children, child => child.props.label);

  return (
    <>
      <Tabs className="navigation" value={value} onChange={handleChange}>
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab} {...a11yProps(index)} />
        ))}
      </Tabs>
      <SwipeableViews axis="x" index={value} onChangeIndex={handleChangeIndex}>
        {children}
      </SwipeableViews>
    </>
  );
}
