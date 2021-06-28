import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '../Select';
import { Box } from '@material-ui/core';
import Flex from '../Flex/Flex';
import FormHelperText from '@material-ui/core/FormHelperText';
import { DatePicker } from '@lrewater/lre-react';

const useStyles = makeStyles(theme => ({
  root: {},
  picker: {
    margin: theme.spacing(1)
  }
}));

const DateControl = ({
                       name = 'date',
                       label = 'Date',
                       value = '',
                       variant = 'outlined',
                       onChange = () => {},
                       error = false,
                       errorMessage = '',
                     }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Flex>
        <DatePicker
          error={error}
          className={classes.picker}
          name={name}
          label={label}m
          value={value}
          variant={variant}
          width={'100%'}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={onChange}
          style={{
            backgroundColor: 'white',
            width: '100%'
          }}
        />
      </Flex>
      {error && <Box pl={1} pr={1}><FormHelperText error>{errorMessage}</FormHelperText></Box>}
    </div>
  );
};

export default DateControl;
