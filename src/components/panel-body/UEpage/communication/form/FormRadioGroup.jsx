import { FormControlLabel, Radio, RadioGroup, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  radio: {
    width: '100%',
    minWidth: '25em',
    paddingLeft: '2em',
  },
}));

export const FormRadioGroup = ({ groupSelectedValue, groupHandleChange, groupValues }) => {
  const classes = useStyles();

  return (
    <RadioGroup
      name="communication-radio-group"
      value={groupSelectedValue}
      onChange={groupHandleChange}
      className={classes.radio}
    >
      {groupValues.map(val => (
        <FormControlLabel
          key={val.value}
          value={val.value}
          control={<Radio disabled={val.disabled} />}
          label={val.label}
        />
      ))}
    </RadioGroup>
  );
};
