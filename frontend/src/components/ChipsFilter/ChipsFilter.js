import React from "react";
// import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0, 0.5, 0.5, 0),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.main,
      color: "#ffffff",
    },
  },
}));

const ChipsFilter = ({
  title,
  name,
  data,
  values,
  onChange,
  valueField,
  displayField,
}) => {
  const classes = useStyles();

  return (
    <Box>
      {title && (
        <Typography variant="body1" paragraph>
          {title}
        </Typography>
      )}
      {data.map((d) => (
        <Chip
          key={d[valueField]}
          color={values.includes(d[valueField]) ? "secondary" : "default"}
          onClick={() => onChange(name, d[valueField])}
          className={classes.chip}
          clickable={false}
          label={d[displayField]}
          variant={values.includes(d[valueField]) ? "default" : "outlined"}
        />
      ))}
    </Box>
  );
};

ChipsFilter.propTypes = {};

export default ChipsFilter;
