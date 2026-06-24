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
import { v4 as uuidv4 } from 'uuid';

type SwipeableTabProps = {
  label: string;
  default?: boolean;
};

export function SwipeableTab(props: Readonly<PropsWithChildren<SwipeableTabProps>>) {
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
  const validChildren = Children.toArray(children).filter(isValidElement) as ReactElement<{
    label: string;
    default?: boolean;
  }>[];

  const defaultIndex = validChildren.findIndex(child => child.props.default === true) ?? 0;

  const [value, setValue] = useState(defaultIndex);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const tabs = validChildren.map((child, index) => (
    <Tab key={uuidv4()} label={child.props.label} {...a11yProps(index)} />
  ));

  return (
    <>
      <Tabs className="navigation" value={value} onChange={handleChange}>
        {tabs}
      </Tabs>

      <SwipeableViews axis="x" index={value} onChangeIndex={handleChangeIndex}>
        {validChildren.map((child, index) => (
          <div
            key={child.key || index}
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
