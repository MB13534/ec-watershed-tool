import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { setInputColor, setWidth, setClass } from "../../utils";

const useStyles = makeStyles(theme => ({
  FormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    "& label": {
      color: props => setInputColor(props.labelColor, theme)
    }
  },
  outlinedFormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    "& fieldset": {
      borderColor: props => setInputColor(props.outlineColor, theme),
      borderWidth: 1.5
    },
    "& label": {
      color: props => setInputColor(props.labelColor, theme)
    },
    "& div": {
      backgroundColor: props => props.fillColor
    },
    "& div:hover": {
      backgroundColor: props => props.fillColor
    },
    "& div:focus": {
      backgroundColor: props => props.fillColor
    },
    "& input:hover": {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    "& input:focus": {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
  },
  filledFormControl: {
    margin: theme.spacing(1),
    minWidth: 150,
    "& div": {
      backgroundColor: props => props.fillColor
    },
    "& div:hover": {
      backgroundColor: props => props.fillColor
    },
    "& div:focus": {
      backgroundColor: props => props.fillColor
    },
    "& input:hover": {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    "& input:focus": {
      backgroundColor: props => props.fillColor,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4
    },
    "& label": {
      color: props => setInputColor(props.labelColor, theme)
    }
  }
}));

const SingleSelectFilter = props => {
  const {
    name,
    label,
    valueField,
    displayField,
    data = [],
    value = "",
    variant = "standard",
    onChange,
    width,
    outlineColor,
    fillColor,
    labelColor,
    ...other
  } = props;
  const classes = useStyles({ outlineColor, fillColor, labelColor });

  return (
    <FormControl
      className={setClass(classes, variant, "FormControl")}
      variant={variant}
      style={{ width: setWidth(width, other.fullWidth) }}
      {...other}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        data-testid="single-select"
        labelId={`${name}-label`}
        id={name}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
      >
        {data.map(val => (
          <MenuItem key={val[valueField]} value={val[valueField]}>
            {val[displayField]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

SingleSelectFilter.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  valueField: PropTypes.string.isRequired,
  displayField: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  variant: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  outlineColor: PropTypes.string,
  fillColor: PropTypes.string,
  labelColor: PropTypes.string
};

export default SingleSelectFilter;