import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Select from '../Select';
import { Box, Slider, Typography, Grid, IconButton } from '@material-ui/core';
import RemoveParameterIcon from '@material-ui/icons/Close';
import Flex from '../Flex/Flex';
import FormHelperText from '@material-ui/core/FormHelperText';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const ControlParameter = ({
                            name = 'parameter',
                            label = 'Parameter',
                            value = '',
                            weightValue = 1,
                            index = 0,
                            variant = 'outlined',
                            data = [],
                            valueField = 'value',
                            displayField = 'name',
                            onParameterChange = () => {},
                            onWeightChange = () => {},
                            onRemoveParameter = () => {},
                            allowRemove = false,
                            width,
                            fullWidth = false,
                            outlineColor,
                            fillColor = '#fff',
                            labelColor,
                            error = false,
                            errorMessage = '',
                          }) => {
  const classes = useStyles();

  const [sliderValue, setSliderValue] = useState(weightValue);

  const sliderValueLabelFormat = (value) => {
    return parseInt(value * 100) + '%';
  };

  useEffect(() => {
    setSliderValue(weightValue);
  }, [weightValue]);

  return (
    <div className={classes.root}>
      <Flex>
        <Select
          error={error}
          name={name}
          label={label}
          valueField={valueField}
          displayField={displayField}
          data={data}
          variant={variant}
          value={value}
          onChange={onParameterChange}
          width={width}
          fullWidth={fullWidth}
          outlineColor={outlineColor}
          fillColor={fillColor}
          labelColor={labelColor}
          margin="dense"
        />
        {allowRemove &&
        <IconButton
          size="small"
          color="primary"
          onClick={() => onRemoveParameter(name, value, index)}
          aria-label="remove parameter"
          className={classes.btn}
        >
          <RemoveParameterIcon />
        </IconButton>
        }
      </Flex>
      {error && <Box pl={1} pr={1}><FormHelperText error>{errorMessage}</FormHelperText></Box>}
      <Box p={1}>
        <Grid container alignItems="center">
          <Grid item xs={4}>
            <Typography id="continuous-slider" variant="body2" gutterBottom>
              Weight: <strong>{sliderValueLabelFormat(weightValue)}</strong>
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Slider
              name={`${name}Weight`}
              min={0}
              step={0.1}
              max={2}
              value={sliderValue}
              onChange={(event, value) => setSliderValue(value)}
              onChangeCommitted={(event, weight) => onWeightChange(name, weight, value, index)}
              valueLabelDisplay="auto"
              valueLabelFormat={sliderValueLabelFormat}
              aria-labelledby="continuous-slider"
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ControlParameter;
