import { EditableTextField } from './EditableTextField';
import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1em',
  },
}));

export const EditableTextFieldWithClickableIcon = ({
  id,
  label,
  defaultValue = '',
  icons = [],
  onChangeFunction,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.row}>
      <EditableTextField
        id={id}
        label={label}
        defaultValue={defaultValue}
        onChangeFunction={onChangeFunction}
      />
      {icons.map(Icon => (
        <Icon />
      ))}
    </div>
  );
};
