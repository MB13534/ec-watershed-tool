import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, Divider, Grid } from '@material-ui/core'
import LayerSearch from '../LayerSearch'
import FilterIcon from '@material-ui/icons/FilterList'
import LayersList from '../LayerList'
import { MapContext } from '../../pages/Map/MapProvider';

const useStyles = makeStyles(theme => ({
  root: {},
}))

const LayersPanel = (props) => {
  const classes = useStyles()
  const {
    map,
    filterActive,
    filteredLayers,
    controls,
    searchValue,
    onLayerChange,
    onFilteredLayerChange,
    onVisibleLayerChange,
    handleControlsVisibility,
    onSearchValueChange,
    resetFilters,
    onSelectAllLayers,
    onSelectNoneLayers,
  } = useContext(MapContext);

  const handleSearch = (e) => {
    onSearchValueChange(e.target.value);
  };

  const handleLayerToggle = (name, layerName) => {
    console.log('handleLayerToggle() layerName', name, layerName);
    console.log('filteredLayers', filteredLayers);
    filteredLayers.forEach((layer) => {
      if (layer.name === name && layer.toggleGroup) {
        let otherLayers = filteredLayers.filter(x => x.toggleGroup === layer.toggleGroup);
        layerName = otherLayers.map(x => x.name);
        console.log('toggleGroup found! with layerName now:', layerName);
      }
    });

    if (name) {
      const setVis = function(layer) {
        const visibility = map.getLayoutProperty(layer, 'visibility');

        if (visibility !== 'visible') {
          map.setLayoutProperty(layer, 'visibility', 'visible');
          map.setLayoutProperty(layer+'-labels', 'visibility', 'visible');
          console.log('showing layer ' + layer);
        } else {
          console.log('hiding layer ' + layer);
          map.setLayoutProperty(layer, 'visibility', 'none');
          map.setLayoutProperty(layer+'-labels', 'visibility', 'none');
        }
      }
      if (Array.isArray(name)) {
        name.forEach((layer) => setVis(layer));
      } else {
        setVis(name);
      }
    }

    onVisibleLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
    onFilteredLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
    onLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.enabled = !rec.enabled;
          rec.visible = rec.enabled ? true : false;
        }
        return rec;
      });
    });
  };

  return (
    <div className={classes.root}>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <LayerSearch
          value={searchValue}
          handleSearch={handleSearch}
          width="95%"
        />
      </Box>
      <Box m={1}>
        <Button
          variant="contained"
          disableElevation
          size="small"
          color="secondary"
          disabled={controls.filterLayers.visible}
          fullWidth
          startIcon={<FilterIcon />}
          onClick={() => handleControlsVisibility("filterLayers")}
        >
          Filter Layers
        </Button>
      </Box>
      <Box m={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              size="small"
              onClick={onSelectAllLayers}
            >
              + Select All
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              size="small"
              onClick={onSelectNoneLayers}
            >
              - Select None
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <LayersList
        items={filteredLayers}
        searchText={searchValue}
        resetFilters={resetFilters}
        handleLayerToggle={handleLayerToggle}
        filterActive={filterActive}
      />
      <Divider />
    </div>
  )
}

export default LayersPanel
