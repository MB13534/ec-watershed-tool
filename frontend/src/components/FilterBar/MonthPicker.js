import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import useFetchData from '../../hooks/useFetchData';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(1),
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  text: {
    fontSize: 18,
    lineHeight: 1.8,
    fontWeight: 400,
  },
}));

const MonthPicker = ({
  id,
  selectedDataSource,
  onDataSourceChange,
  endpoint,
  label,
  placeholder,
  variant = 'outlined',
  size = 'small',
  disableClearable = true,
}) => {
  const classes = useStyles();

  //fetches the a year of months in water years (oct-sep) available as supplyed by the DB with the given endpoint
  const [dataSourceData, dataSourceDataLoading] = useFetchData(endpoint, []);

  //sets the state for the current month selected
  const handleDataSourceChange = (event, value) => {
    onDataSourceChange(value);
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        id={id}
        style={{ width: 130 }}
        options={dataSourceData}
        loading={dataSourceDataLoading}
        getOptionLabel={option => option.month_abbrev}
        getOptionSelected={(option, value) => option.watermonth === value.watermonth}
        value={selectedDataSource}
        disableClearable={disableClearable}
        onChange={handleDataSourceChange}
        renderInput={params => (
          <TextField
            {...params}
            variant={variant}
            label={label}
            size={size}
            placeholder={placeholder}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {dataSourceDataLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default MonthPicker;
