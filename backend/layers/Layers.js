const fs = require('fs');

const parseGeoJSON = path => {
  return JSON.parse(fs.readFileSync(path));
};

// const counties = parseGeoJSON('./layers/Counties.geojson');
// const cdpheLakes2020 = parseGeoJSON('./layers/CDPHE_Lakes_2020.geojson');
// const cdpheStreams2020 = parseGeoJSON('./layers/CDPHE_StreamSegment_2020.geojson');
// const landuse = parseGeoJSON('./layers/Landuse_EagleCounty.geojson');
// const hucs = parseGeoJSON('./layers/HUC12.geojson');
// const parcels = parseGeoJSON('./layers/EagleCounty_Parcels.geojson');

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
    id: 'counties',
    name: 'Counties',
    geometry_type: 'line',
    source: {
      id: 'Counties-36yluy',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.4lqjj410',
    },
    drawOrder: 1,
    legendOrder: 1,
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
    legendOrder: 2,
    enabled: true,
    visible: true,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      ...defaultFillStyles,
      'fill-opacity': 1.0,
      'fill-color': '#0090ff',
    },
  },
  {
    id: 'streams',
    name: 'Streams',
    geometry_type: 'line',
    source: {
      id: 'CDPHE_StreamSegment_2020-b54cte',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.25qquheb',
    },
    drawOrder: 2,
    legendOrder: 2,
    enabled: false,
    visible: false,
    popupType: 'table',
    // Will be creating a custom popupType for this layer
    geometry_type_ndx: 1,
    layer_categories: [2],
    paint: {
      ...defaultLineStyles,
      'line-color': '#6380b5',
      'line-width': 2,
            "line-color": [
              'interpolate',
              ['linear'],
              ['get', 'Cat_ID'],
              1,
              '#005CE6',
              2,
              '#737300',
              3,
              '#38A800',
              4,
              '#A900E6',
              5,
              '#FF0000',
            ],
    },
  },
  {
    id: 'land-use',
    name: 'Land Use',
    geometry_type: 'fill',
    source: {
      id: 'Landuse_EagleCounty-82ftxn',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.bvnzwjmw',
    },
    drawOrder: 3,
    legendOrder: 3,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'LULC_CODE1'],
        1,
        '#DDD93B',
        2,
        '#EDEDCC',
        3,
        '#1B6635',
        4,
        '#AE722A',
        5,
        '#DC9881',
        6,
        '#466EA3',
        7,
        '#B3AFA4',
        8,
        '#BBD7ED',
      ],
    },
  },
  {
    id: 'hucs',
    name: 'HUCs',
    geometry_type: 'fill',
    source: {
      id: 'HUC12-5ax4za',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.5ggz9ivj',
    },
    drawOrder: 4,
    legendOrder: 40,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'OBJECTID'],
        11,
        '#466EA3',
        12,
        '#E9F0F9',
        21,
        '#E1CDCF',
        22,
        '#DC9881',
        23,
        '#EC1C24',
        24,
        '#A91E22',
        31,
        '#B3AFA4',
        41,
        '#69A966',
        42,
        '#1B6635',
        43,
        '#BDCC93',
        52,
        '#D1BB81',
        71,
        '#EDEDCC',
        81,
        '#DDD93B',
        82,
        '#AE722A',
        90,
        '#BBD7ED',
        95,
        '#70A4C1',
      ],
    },
  },
  {
    id: 'zoning',
    name: 'Zoning',
    geometry_type: 'fill',
    source: {
      id: 'Zoning_EagleCounty-dc6gmx',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3h6y8hlp',
    },
    drawOrder: 6,
    legendOrder: 8,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.6,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'ZONING_ID'],
        1,
        '#F5EAC1',
        2,
        '#E7DBBE',
        3,
        '#FABFBE',
        4,
        '#FEEFEF',
        5,
        '#F2F2F2',
        6,
        '#FCDCF8',
        7,
        '#FFFFEE',
        8,
        '#F8F9BC',
        9,
        '#E9E9BD',
        10,
        '#E6F9BC',
        11,
        '#F5FFEE',
        12,
        '#F1F5E6',
        13,
        '#F0F9FF',
        14,
        '#C5F0FF',
        15,
        '#DCECDE',
        16,
        '#C0BFFF',
        17,
        '#C1C1C1',
      ],
    },
  },
  {
    id: 'land-ownership',
    name: 'Land Ownership',
    geometry_type: 'fill',
    source: {
      id: 'COMap_Ownership_Management-0xsj1o',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3x5s9zit',
    },
    drawOrder: 8,
    legendOrder: 8,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'OWNER_ID'],
        1,
        '#466EA3',
        2,
        '#E9F0F9',
        3,
        '#E1CDCF',
        4,
        '#DC9881',
        5,
        '#EC1C24',
        6,
        '#A91E22',
        7,
        '#B3AFA4',
        8,
        '#69A966',
        9,
        '#1B6635',
        10,
        '#BDCC93',
        11,
        '#D1BB81',
        12,
        '#EDEDCC',
        13,
        '#DDD93B',
        14,
        '#AE722A',
        15,
        '#BBD7ED',
        16,
        '#70A4C1',
        17,
        '#70b3C1',
      ],
    },
  },
  {
    id: 'land-management',
    name: 'Land Management',
    geometry_type: 'fill',
    source: {
      id: 'COMap_Ownership_Management-0xsj1o',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3x5s9zit',
    },
    drawOrder: 8,
    legendOrder: 8,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'MANAGER_ID'],
        1,
        '#466EA3',
        2,
        '#E9F0F9',
        3,
        '#E1CDCF',
        4,
        '#DC9881',
        5,
        '#EC1C24',
        6,
        '#A91E22',
        7,
        '#B3AFA4',
        8,
        '#69A966',
        9,
        '#1B6635',
        10,
        '#BDCC93',
        11,
        '#D1BB81',
        12,
        '#EDEDCC',
        13,
        '#DDD93B',
        14,
        '#AE722A',
        15,
        '#BBD7ED',
        16,
        '#70A4C1',
        17,
        '#70b3C1',
      ],
    },
  },
  {
    id: 'cpw-district-boundary',
    name: 'CPW District Boundary',
    geometry_type: 'fill',
    source: {
      id: 'CPW_District_Boundary-beds2n',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.a7bx5ai1',
    },
    drawOrder: 12,
    legendOrder: 12,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [2],
    paint: {
      ...defaultFillStyles,
      'fill-opacity': 0.4,
      'fill-outline-color': '#2f4f4f',
      'fill-color': '#C1C1C1',
    },
  },
  {
    id: 'cpw-crucial-habitat',
    name: 'CPW Crucial Habitat',
    geometry_type: 'fill',
    source: {
      id: 'CPW_CrucialHabitat-4pqkii',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.9bffgbc7',
    },
    drawOrder: 12,
    legendOrder: 12,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.5,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'hexScoreCa'],
              1,
              '#a80000',
              2,
              '#00734c',
              3,
              '#7ab6f5',
              4,
              '#beffe8',
              5,
              '#ffebaf',
            ],
    },
  },
  {
    id: 'cpw-priority-watersheds',
    name: 'CPW Priority Watersheds',
    geometry_type: 'fill',
    source: {
      id: 'CPW_PriorityWatersheds-6jln54',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.4wjp3u7f',
    },
    drawOrder: 12,
    legendOrder: 12,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.6,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'TOTAL'],
              1,
              '#E1E1E1',
              2,
              '#CCCCCC',
              3,
              '#A9AAD4',
              4,
              '#BEE8FF',
            ],
    },
  },            
  {
    id: 'nwi-wetlands',
    name: 'NWI Wetlands',
    geometry_type: 'fill',
    source: {
      id: 'NWI_Wetlands-2buppm',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3oh7g4u0',
    },
    drawOrder: 13,
    legendOrder: 13,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.5,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'WL_ID'],
              1,
              '#0CB6B5',
              2,
              '#BFEEC5',
              3,
              '#3D7813',
              4,
              '#4C9F99',
              5,
              '#9EC4BE',
            ],
    },
  },
  {
    id: 'ec-wildfire-hazard',
    name: 'Wildfire Hazard',
    geometry_type: 'fill',
    source: {
      id: 'EC_Wildfire-8641wc',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.89263asx',
    },
    drawOrder: 13,
    legendOrder: 13,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.4,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'SymbolID'],
              0,
              '#C1C1C1',
              1,
              '#FABEE9',
              2,
              '#F500C7',
              3,
              '#A10085',
              4,
              '#FEFE00',
              5,
              '#F8A900',
              6,
              '#DC0000',
              7,
              '#71FF00',
              8,
              '#FEFE00',
              9,
              '#F8A900',
              10,
              '#71FF00',
              11,
              '#DC0000',
            ],
    },
  },
  {
    id: 'fema-floodhazard',
    name: 'FEMA Flood Hazard',
    geometry_type: 'fill',
    source: {
      id: 'FEMA_FloodHazard_EagleCounty-23d76i',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.a4umdls4',
    },
    drawOrder: 14,
    legendOrder: 14,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [2,3],
    paint: {
      'fill-opacity': 0.6,
      'fill-outline-color': '#A2CFD6',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'FLDZ_ID'],
              1,
              '#096EE2',
              2,
              '#A15D6A',
              3,
              '#3190F6',
              4,
              '#14448C',
              5,
              '#B8CBD1',
              6,
              '#8BEECD',
              7,
              '#B1D4AC',
            ],
    },
  },
  {
    id: 'nlcd-developed',
    name: 'NLCD Developed',
    geometry_type: 'fill',
    source: {
      id: 'NLCD_Developed-bx720i',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3o0cfytx',
    },
    drawOrder: 15,
    legendOrder: 15,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [1,3],
    paint: {
      'fill-opacity': 0.6,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'gridcode'],
              21,
              '#E6D1D1',
              22,
              '#DD9E8A',
              23,
              '#F40000',
              24,
              '#AD0000',
            ],
    },
  },
  {
    id: 'nlcd-vegetation',
    name: 'NLCD Vegetation',
    geometry_type: 'fill',
    source: {
      id: 'NLCD_Vegetation-4rqtdp',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.9j3ro53w',
    },
    drawOrder: 15,
    legendOrder: 15,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [1,3],
    paint: {
      'fill-opacity': 0.6,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'Value'],
              11,
              '#466EA3',
              12,
              '#E9F0F9',
              31,
              '#B3AFA4',
              41,
              '#69A966',
              42,
              '#1B6635',
              43,
              '#BDCC93',
              52,
              '#D1BB81',
              71,
              '#EDEDCC',
              81,
              '#DDD93B',
              82,
              '#AE722A',
              90,
              '#BBD7ED',
              95,
              '#70A4C1',
            ],
    },
  },
  {
    id: 'cnhp-pca',
    name: 'CNHP Potential Conservation Areas',
    geometry_type: 'fill',
    source: {
      id: 'CNHP_L4_PCAs11_2019-6v498f',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3bedhzsy',
    },
    drawOrder: 16,
    legendOrder: 16,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      'fill-opacity': 0.7,
      'fill-outline-color': '#AAAAAA',
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'BIO_ID'],
              1,
              '#810f7c',
              2,
              '#8856a7',
              3,
              '#8c96c6',
              4,
              '#9ebcda',
              5,
              '#bfd3e6',
            ],
     },
  },
  {
    id: 'cnhp-nca',
    name: 'CNHP Network of Conservation Areas',
    geometry_type: 'fill',
    source: {
      id: 'CNHP_L4_NCAs11_2019-6cq5jh',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.7m9l0ggu',
    },
    drawOrder: 16,
    legendOrder: 16,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [2],
    paint: {
      ...defaultFillStyles,
      'fill-opacity': 0.4,
      'fill-outline-color': '#000000',
      'fill-color': '#FFDD3C',
    },
  },
  {
    id: 'usgs-streamflow-stations',
    name: 'USGS Streamflow Stations',
    geometry_type: 'circle',
    source: {
      id: 'USGS_StreamflowStations-5qor4i',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.8uuytqjz',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 4,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#AAAAAA',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'epa-frs-wtp',
    name: 'WTP/WWTF',
    geometry_type: 'circle',
    source: {
      id: 'EPA_FRS_WTP-3j8oef',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.5tsregec',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 7,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#00A3E0',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'owts',
    name: 'OWTS',
    geometry_type: 'circle',
    source: {
      id: 'OWTS_EagleCounty-4e0p9w',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.b7sm9l8o',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 7,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#6CC24a',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cdss-structures-surface-water',
    name: 'Structures | Surface Water',
    geometry_type: 'circle',
    source: {
      id: 'CDSS_Structures_Surface-8dminx',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.c3kl3wmz',
    },
    drawOrder: 30,
    legendOrder: 30,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 2,
      'circle-opacity': 0.7,
      'circle-stroke-opacity': 1,
      'circle-color': '#e600a9',
      'circle-stroke-color': '#e600a9',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cdss-structures-ground-water',
    name: 'Structures | Ground Water',
    geometry_type: 'circle',
    source: {
      id: 'CDSS_Structures_GroundWater-1zmd2k',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.4oqgcwch',
    },
    drawOrder: 31,
    legendOrder: 31,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 2,
      'circle-opacity': 0.7,
      'circle-stroke-opacity': 1,
      'circle-color': '#a87000',
      'circle-stroke-color': '#a87000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cdss-structures-reservoir',
    name: 'Structures | Reservoir',
    geometry_type: 'circle',
    source: {
      id: 'CDSS_Structures_Reservoir-da67y7',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3p3ky3k9',
    },
    drawOrder: 32,
    legendOrder: 32,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 2,
      'circle-opacity': 0.7,
      'circle-stroke-opacity': 1,
      'circle-color': '#0070ff',
      'circle-stroke-color': '#0070ff',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cdss-structures-minimum-flow',
    name: 'Structures | Minimum Flow',
    geometry_type: 'circle',
    source: {
      id: 'CDSS_Structures_MinimumFlow-8il7ma',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.bwj73y7z',
    },
    drawOrder: 33,
    legendOrder: 33,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 2,
      'circle-opacity': 0.7,
      'circle-stroke-opacity': 1,
      'circle-color': '#ffaa00',
      'circle-stroke-color': '#ffaa00',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cdss-structures-other',
    name: 'Structures | Other',
    geometry_type: 'circle',
    source: {
      id: 'CDSS_Structures_Other-ba2utg',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.5gvpcukl',
    },
    drawOrder: 34,
    legendOrder: 34,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 2,
      'circle-opacity': 0.7,
      'circle-stroke-opacity': 1,
      'circle-color': '#38a800',
      'circle-stroke-color': '#38a800',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'diversion-structures',
    name: 'Diversion Structures',
    geometry_type: 'line',
    source: {
      id: 'Diversion_Structures-8l3qvv',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.5m9u0de8',
    },
    drawOrder: 35,
    legendOrder: 35,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 1,
    layer_categories: [2],
    paint: {
      ...defaultLineStyles,
      'line-color': '#FF6700',
      'line-width': 3,
    },
  },
  {
    id: 'cpw-facilties',
    name: 'CPW Facilities',
    geometry_type: 'circle',
    source: {
      id: 'CPW_Facilities-9r7u04',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.32x8nlly',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 4,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#006400',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cpw-trailheads',
    name: 'CPW Trailheads',
    geometry_type: 'circle',
    source: {
      id: 'CPW_COTREX_Trailheads-15vunx',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.53c6g9k4',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    popupType: 'table',
    geometry_type_ndx: 2,
    layer_categories: [1,3],
    paint: {
      ...defaultCircleStyles,
      'circle-radius': 4,
      'circle-opacity': 1,
      'circle-stroke-opacity': 1,
      'circle-color': '#228B22',
      'circle-stroke-color': '#000000',
      'circle-stroke-width': 1,
    },
  },
  {
    id: 'cpw-trails',
    name: 'CPW Trails',
    geometry_type: 'line',
    source: {
      id: 'CPW_COTREX_Trails-d0vt4n',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.dujyeuoa',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 1,
    layer_categories: [3],
    paint: {
      ...defaultLineStyles,
      'line-color': '#6B8E23',
      'line-width': 1,
    },
  },
  {
    id: 'cpw-designated-trails',
    name: 'CPW Designated Trails',
    geometry_type: 'line',
    source: {
      id: 'CPW_DesignatedTrails-2lls1k',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.3grts0nl',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 1,
    layer_categories: [3],
    paint: {
      ...defaultLineStyles,
      'line-color': '#8FBC8F',
      'line-width': 1,
    },
  },
  {
    id: 'cpw-goldmedalstreams',
    name: 'CPW Gold Medal Streams',
    geometry_type: 'line',
    source: {
      id: 'CPW_GoldMedalStreams-atpinp',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.c6fny8ga',
    },
    drawOrder: 45,
    legendOrder: 45,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 1,
    layer_categories: [3],
    paint: {
      ...defaultLineStyles,
      'line-color': '#008080cd',
      'line-width': 2,
    },
  },
  {
    id: 'stream-stations',
    name: 'Stream Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
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
    id: 'reservoir-stations',
    name: 'Reservoir Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
    drawOrder: 50,
    legendOrder: 60,
    enabled: false,
    visible: false,
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
    id: 'effluent-stations',
    name: 'Effluent Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
    drawOrder: 50,
    legendOrder: 70,
    enabled: false,
    visible: false,
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
    id: 'mine-discharge-stations',
    name: 'Mine Discharge Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
    drawOrder: 50,
    legendOrder: 80,
    enabled: false,
    visible: false,
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
    id: 'spring-stations',
    name: 'Spring Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
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
    id: 'groundwater-stations',
    name: 'Groundwater Stations',
    geometry_type: 'circle',
    source: {
      type: 'geojson',
    },
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
    id: 'parcels-info',
    name: 'Parcels (Info)',
    geometry_type: 'fill',
    source: {
      id: 'EagleCounty_Parcels-852e27',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.bns5v4l3',
    },
    drawOrder: 5,
    legendOrder: 6,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    popupType: 'table',
    geometry_type_ndx: 3,
    layer_categories: [3],
    paint: {
      ...defaultFillStyles,
      'fill-color': 'white',
      'fill-opacity': 0,
      'fill-outline-color': 'black',
    },
  },
  {
    id: 'parcels',
    name: 'Parcels',
    geometry_type: 'line',
    source: {
      id: 'EagleCounty_Parcels-852e27',
      type: 'vector',
      url: 'mapbox://ecwatershedtool.bns5v4l3',
    },
    drawOrder: 5,
    legendOrder: 5,
    enabled: false,
    visible: false,
    toggleGroup: 1,
    geometry_type_ndx: 1,
    layer_categories: [3],
    paint: {
      ...defaultLineStyles,
      'line-color': '#fffe8f',
      'line-width': 1,
    },
  },
];

const StreamLayers = [];

module.exports = {
  Layers: Layers,
  ParcelLayers: ParcelLayers,
  StreamLayers: StreamLayers,
};
