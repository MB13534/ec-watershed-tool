import React from 'react';
// import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  Box,
  Checkbox,
  ListItemSecondaryAction,
  Typography,
  Divider,
  Button,
  Tooltip,
} from '@material-ui/core';
import LineIcon from '../../images/line_icon.png';
import PolygonIcon from '../../images/polygon_icon.png';
import PointIcon from '../../images/point_icon.png';

const useStyles = makeStyles(theme => ({
  root: {
    height: 525,
    overflowY: 'scroll',
  },
  img: {
    width: '100%',
  },
  listItemText: {
    color: props => (props.enabled ? theme.palette.text.primary : theme.palette.text.secondary),
    fontWeight: props => (props.enabled ? 500 : 400),
  },
  secondaryAction: {
    display: 'flex',
    alignItems: 'center',
  },
  zoomIcon: {
    // marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const setIcon = type => {
  const geometryFormatted = type.toLowerCase();
  if (geometryFormatted === 'line') return LineIcon;
  if (geometryFormatted === 'fill') return PolygonIcon;
  if (geometryFormatted === 'circle') return PointIcon;
};

const LayerListItem = ({
  name,
  layerName,
  geometryType,
  enabled,
  handleLayerToggle,
  description = 'No description available.',
}) => {
  const classes = useStyles({ enabled });

  return (
    <>
      <Tooltip title={description} arrow placement="bottom">
        <ListItem button>
          <Box width={20} mr={2}>
            <img src={setIcon(geometryType)} alt={geometryType} className={classes.img} />
          </Box>
          <ListItemText primary={name} className={classes.listItemText} />
          <ListItemSecondaryAction className={classes.secondaryAction}>
            <Checkbox
              edge="start"
              checked={enabled}
              tabIndex={-1}
              disableRipple
              inputProps={{ 'aria-labelledby': 'Layer Toggle' }}
              color="primary"
              onChange={() => handleLayerToggle(name, layerName)}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </Tooltip>
      {/* <Divider /> */}
    </>
  );
};

const LayersList = ({ items, searchText, resetFilters, handleLayerToggle, filterActive }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {filterActive && (
        <Box m={1} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" color="primary">
            {items.length} results found
          </Typography>
          <Button variant="contained" disableElevation size="small" onClick={resetFilters}>
            Clear
          </Button>
        </Box>
      )}
      <Divider />
      <List dense>
        {items.length === 0 ? (
          <Box m={1} textAlign="center">
            <Typography variant="body1">No layers found</Typography>
          </Box>
        ) : (
          items
            .filter(x => !x.hideFromLegend)
            .sort((a, b) => (a.legendOrder > b.legendOrder ? 1 : -1))
            .map((item, i) => {
              return (
                <LayerListItem
                  name={item.name}
                  layerName={item.layer_name}
                  geometryType={item.geometry_type}
                  enabled={item.enabled}
                  key={item.name}
                  handleLayerToggle={handleLayerToggle}
                  description={item.description}
                />
              );
            })
        )}
      </List>
    </div>
  );
};

LayersList.propTypes = {};

export default LayersList;
