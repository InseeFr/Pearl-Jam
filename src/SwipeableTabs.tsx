import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { TabType } from 'pages/SurveyUnitPage';
import {
  Children,
  PropsWithChildren,
  useState,
  ReactNode,
  isValidElement,
  ReactElement,
} from 'react';
import { useSearchParams } from 'react-router-dom';
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

export function SwipeableTabs({
  children,
  availableTabs,
}: Readonly<{ children: ReactNode; availableTabs: TabType[] }>) {
  const [, setSearchParams] = useSearchParams();
  const validChildren = Children.toArray(children).filter(isValidElement) as ReactElement<{
    label: string;
    default?: boolean;
  }>[];

  const defaultIndex = validChildren.findIndex(child => child.props.default === true) ?? 0;

  const [value, setValue] = useState(defaultIndex);

  const handleChange = (event: unknown, newValue: number) => {
    setValue(newValue);
    setSearchParams({ tab: availableTabs[newValue] });
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
    setSearchParams({ tab: availableTabs[index] });
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
