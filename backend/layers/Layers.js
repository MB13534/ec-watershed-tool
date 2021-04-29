const fs = require('fs');

const parseGeoJSON = (path) => {
  return JSON.parse(fs.readFileSync(path));
};

const counties = parseGeoJSON('./layers/Counties.geojson');
const cdpheLakes2020 = parseGeoJSON('./layers/CDPHE_Lakes_2020.geojson');
const cdpheStreams2020 = parseGeoJSON('./layers/CDPHE_StreamSegment_2020.geojson');
const landuse = parseGeoJSON('./layers/Landuse_EagleCounty.geojson');
const hucs = parseGeoJSON('./layers/HUC12.geojson');
const parcels = parseGeoJSON('./layers/EagleCounty_Parcels.geojson');

const locs_Streams = parseGeoJSON('./layers/locs_Streams.geojson');
const locs_Springs = parseGeoJSON('./layers/locs_Springs.geojson');
const locs_Reservoirs = parseGeoJSON('./layers/locs_Reservoirs.geojson');
const locs_Mine_Discharge = parseGeoJSON('./layers/locs_Mine_Discharge.geojson');
const locs_Groundwater = parseGeoJSON('./layers/locs_Groundwater.geojson');
const locs_Effluent = parseGeoJSON('./layers/locs_Effluent.geojson');

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

const Layers = [
  {
    name: 'Counties',
    geometry_type: 'line',
    drawOrder: 1,
    legendOrder: 1,
    enabled: true,
    visible: true,
    popupType: 'none',
    geometry_type_ndx: 1,
    layer_categories: [1],
    spatial_data: counties,
    paint: {
      ...defaultLineStyles,
      "line-color": "#000000",
      "line-width": 4,
    },
  },
  {
    name: 'Lakes',
    geometry_type: 'fill',
    drawOrder: 2,
    legendOrder: 2,
    enabled: true,
    visible: true,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [2],
    spatial_data: cdpheLakes2020,
    paint: {
      ...defaultFillStyles,
      'fill-opacity':1.0,
      'fill-color':'#0090ff'
    },
  },
  {
    name: 'Streams',
    geometry_type: 'line',
    drawOrder: 2,
    legendOrder: 2,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 1,
    layer_categories: [2],
    spatial_data: cdpheStreams2020,
    paint: {
      ...defaultLineStyles,
      "line-color": "#6380b5",
      "line-width": 2,
    },
  },
  {
    name: 'Land Use',
    geometry_type: 'fill',
    drawOrder: 3,
    legendOrder: 3,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    spatial_data: landuse,
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'LULC_CODE1'],
        1,'#DDD93B',
        2,'#EDEDCC',
        3,'#1B6635',
        4,'#AE722A',
        5,'#DC9881',
        6,'#466EA3',
        7,'#B3AFA4',
        8,'#BBD7ED',
      ],
    },
  },
  {
    name: 'HUCs',
    geometry_type: 'fill',
    drawOrder: 4,
    legendOrder: 40,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    spatial_data: hucs,
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'OBJECTID'],
        11, '#466EA3',
        12, '#E9F0F9',
        21, '#E1CDCF',
        22, '#DC9881',
        23, '#EC1C24',
        24, '#A91E22',
        31, '#B3AFA4',
        41, '#69A966',
        42, '#1B6635',
        43, '#BDCC93',
        52, '#D1BB81',
        71, '#EDEDCC',
        81, '#DDD93B',
        82, '#AE722A',
        90, '#BBD7ED',
        95, '#70A4C1',
      ],
    },
  },
  {
    name: 'Stream Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 50,
    enabled: true,
    visible: true,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Streams,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
  {
    name: 'Reservoir Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 60,
    enabled: true,
    visible: true,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Reservoirs,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
  {
    name: 'Effluent Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 70,
    enabled: true,
    visible: true,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Effluent,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
  {
    name: 'Mine Discharge Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 80,
    enabled: true,
    visible: true,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Mine_Discharge,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
  {
    name: 'Spring Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 90,
    enabled: false,
    visible: false,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Springs,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
  {
    name: 'Groundwater Stations',
    geometry_type: 'circle',
    drawOrder: 50,
    legendOrder: 100,
    enabled: false,
    visible: false,
    popupType: 'point',
    geometry_type_ndx: 2,
    layer_categories: [4],
    spatial_data: locs_Groundwater,
    paint: {
      ...defaultCircleStyles,
      'circle-color': '#69A966',
      'circle-stroke-width': 1,
    },
  },
];

const ParcelLayers = [
  {
    name: 'Parcels (Info)',
    geometry_type: 'fill',
    drawOrder: 5,
    legendOrder: 6,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    spatial_data: parcels,
    paint: {
      ...defaultFillStyles,
      'fill-color': 'white',
      'fill-opacity': 0,
      'fill-outline-color': 'black',
    },
  },
  {
    name: 'Parcels',
    geometry_type: 'line',
    drawOrder: 5,
    legendOrder: 5,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 2,
    layer_categories: [3],
    spatial_data: parcels,
    paint: {
      ...defaultLineStyles,
      'line-color': '#fffe8f',
      'line-width': 1,
    },
  },
];

const StreamLayers = [
];

module.exports = {
  Layers: Layers,
  ParcelLayers: ParcelLayers,
  StreamLayers: StreamLayers,
};
