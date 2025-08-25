import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import {
  Children,
  PropsWithChildren,
  useState,
  ReactNode,
  isValidElement,
  ReactElement,
} from 'react';

import SwipeableViews from 'react-swipeable-views';

export function SwipeableTab(props: Readonly<PropsWithChildren<{ label: string }>>) {
  const { children } = props;
  return <Box sx={{ p: 4 }}>{children}</Box>;
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export function SwipeableTabs({ children }: Readonly<{ children: ReactNode }>) {
  const [value, setValue] = useState(0);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const validChildren = Children.toArray(children).filter(isValidElement);
  const tabs = validChildren.map((child, index) => {
    const el = child as ReactElement<{ label: string }>;
    return <Tab key={index} label={el.props.label} {...a11yProps(index)} />;
  });

  return (
    <>
      <Tabs className="navigation" value={value} onChange={handleChange}>
        {tabs}
      </Tabs>
      <SwipeableViews axis="x" index={value} onChangeIndex={handleChangeIndex}>
        {validChildren.map((child, index) => (
          <div
            key={index}
            role="tabpanel"
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
          >
            {child}
          </div>
        ))}
      </SwipeableViews>
    </>
  );
}
