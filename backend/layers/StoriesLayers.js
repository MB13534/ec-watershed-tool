const defaultCircleStyles = {
  'circle-color': '#444',
  'circle-radius': 6,
  'circle-stroke-color': '#333',
  'circle-stroke-width': 1.5,
  'circle-stroke-opacity': 0,
  'circle-opacity': 0,
};

const defaultLineStyles = {
  'line-color': '#444',
  'line-width': 2,
};

const defaultFillStyles = {
  'fill-color': '#444',
  'fill-opacity': 0.8,
};

const StoriesLayers = [
  {
    markerType: 'usgs',
    id: 'usgs-streamflow-stations',
    name: 'USGS Streamflow Stations',
    geometry_type: 'circle',
    source: {
      id: 'USGS_StreamflowStations-5qor4i',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.8uuytqjz',
    },
    drawOrder: 45,
    legendOrder: -4,
    enabled: true,
    visible: true,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [2, 4],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 6,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#fff',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'counties',
    name: 'Counties',
    geometry_type: 'line',
    source: {
      id: 'Counties-36yluy',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.4lqjj410',
    },
    drawOrder: 1,
    legendOrder: 3,
    enabled: true,
    visible: true,
    popupType: 'none',
    geometry_type_ndx: 1,
    layer_categories: [1],
    paint: {
      ...defaultLineStyles,
      'line-color': '#000000',
      'line-width': 4,
    },
  },
  {
    id: 'lakes',
    name: 'Lakes',
    geometry_type: 'fill',
    source: {
      id: 'CDPHE_Lakes_2020-ba4d1y',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.1cwgbp2g',
    },
    drawOrder: 2,
    legendOrder: 4,
    enabled: true,
    visible: true,
    popupType: 'none',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      ...defaultFillStyles,
      'fill-opacity': 1.0,
      'fill-color': '#0090ff',
    },
  },
];

module.exports = {
  StoriesLayers: StoriesLayers,
};
