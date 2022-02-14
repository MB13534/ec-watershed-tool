import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const styles = theme => ({
  chip: {
    margin: 2,
    '&:hover': {
      cursor: 'pointer!important',
      backgroundColor: theme.palette.secondary.main,
      color: `#ffffff`,
    },
  },
});

const Chips = props => {
  const { classes, data, valueField, displayField, handleChipClick, activeChips = [] } = props;
  return data.map(d => (
    <Tooltip key={d[valueField]} arrow placement="bottom" title={props.tooltipField ? d[props.tooltipField] : ''}>
      <Chip
        data-value={d.valueField}
        label={d[displayField]}
        color={activeChips.includes(d[valueField]) ? 'secondary' : 'default'}
        clickable={false}
        onClick={handleChipClick}
        className={classes.chip}
      />
    </Tooltip>
  ));
};

Chips.propTypes = {
  data: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(Chips);
