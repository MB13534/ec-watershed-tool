import React, { useContext, useEffect, useState } from 'react';
import matchSorter from 'match-sorter';

import useFetchData from '../../hooks/useFetchData';

import { dateFormatter } from '../../utils';

import StreetsImg from '../../images/streets.png';
import OutdoorsImg from '../../images/outdoors.png';
import SatelliteImg from '../../images/satellite.jpg';
import axios from 'axios';
import { useAuth0 } from '../../hooks/useAuth0';
import useFormSubmitStatus from '../../hooks/useFormSubmitStatus';

/**
 * Create a context that will be used to share global state
 * throughout the Map page.
 * The context contains stores state such as the currently selected
 * water year and month and the current water year
 * It also contains a handler for when the water year/month
 * filters are changed by the user
 */
export const MapContext = React.createContext({
  map: {},
  controls: {},
  activeZoomToLayerSpatialData: {},
  activeBasemap: {},
  basemapLayers: [],
  layers: [],
  analysisTypes: [],
  priorities: [],
  threats: [],
  filters: {},
  filteredLayers: [],
  visibleLayers: [],
  filterValues: {},
  searchValue: '',
  filterActive: false,
  updateRenderedPoints: () => {},
  onMapChange: () => {},
  handleFilters: (name, value) => {},
  handleControlsVisibility: () => {},
  onZoomToLayerChange: () => {},
  onBasemapChange: () => {},
  onLayerChange: () => {},
  onFilteredLayerChange: () => {},
  onVisibleLayerChange: () => {},
  onFilterValuesChange: () => {},
  onSearchValueChange: () => {},
  resetFilters: () => {},
  onSelectAllLayers: () => {},
  onSelectAllParameters: () => {},
  onSelectNoneLayers: () => {},
  onSelectNoneParameters: () => {},
  handleControlsSubmit: () => {},
});

export const DummyBasemapLayers = [
  {
    name: 'Streets',
    styleURL: 'mapbox://styles/mapbox/streets-v11',
    image: StreetsImg,
  },
  {
    name: 'Outdoors',
    styleURL: 'mapbox://styles/mapbox/outdoors-v11',
    image: OutdoorsImg,
  },
  {
    name: 'Satellite',
    styleURL: 'mapbox://styles/mapbox/satellite-streets-v11',
    //styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
    image: SatelliteImg,
  },
];

/**
 * Utility function used to check if a the drawer is currently open
 * @param {*} val
 */
const checkControlOpen = (val, defaultVisibility = true) => {
  if (val === null || val === 'undefined') {
    return defaultVisibility;
    //eslint-disable-next-line
  } else if (val == 'true') {
    return true;
    //eslint-disable-next-line
  } else if (val == 'false') {
    return false;
  }
};

/**
 * Create the context provider for the map context
 * @param {*} props
 */
export const MapProvider = props => {
  const { getTokenSilently } = useAuth0();

  const analysisTypes = [
    { value: '85', display: '85th percentile' },
    { value: 'med', display: 'Median' },
  ];

  const [mapMode, setMapMode] = useState('explore');

  const defaultFilters = {
    startDate: '2020-04-01',
    endDate: '2020-10-30',
    analysisType: 'Median',
    priorities: ['Field/Chemistry', 'Metals/Ions', 'Nutrients/Solids', 'Pathogens'],
    threats: [
      'Agriculture',
      'Development',
      'Mining',
      'Natural',
      'OWTS',
      'Oil and Gas',
      'Recreation',
      'Transportation',
      'WWTPs',
      'Wildfire',
    ],
    parameters: [
      //      "Hardness",
      'TP',
      'Cu-D',
    ],
  };

  // initialize the default sidebar filter values
  const [filters, setFilters] = useState(defaultFilters);
  const [refresh, setRefresh] = useState(false);

  const [priorities] = useFetchData(`controls-list-param/priorities`);
  const [threats] = useFetchData(`controls-list-param/threats`);
  const [startDate] = useFetchData(`controls-list-param/startDate`);
  const [endDate] = useFetchData(`controls-list-param/endDate`);
  const [parameters, setParameters] = useState([]);
  const [scenarioDialogIsOpen, setScenarioDialogIsOpen] = useState(false);
  const [scenarioDialogMode, setScenarioDialogMode] = useState('save');

  const [scenarioData, setScenarioData] = useState(defaultFilters);

  const [snackbarSuccessMessage, setSnackbarSuccessMessage] = useState('The operation completed successfully!');
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState('The operation encountered an error.');
  const setSnackbarMessage = (success, error) => {
    setSnackbarSuccessMessage(success);
    setSnackbarErrorMessage(error);
  };

  const { setWaitingState, snackbarOpen, snackbarError, handleSnackbarClose } = useFormSubmitStatus();

  const [fetchedGeometryData, setFetchedGeometryData] = useState([]);

  const triggerLoadGeometryData = data => {
    setFetchedGeometryData(data);
  };

  const handleRefresh = () => {
    setRefresh(state => !state);
  };

  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (!first) {
      handleControlsSubmit();
    }

    setFirst(false);
  }, [refresh]);

  const handleScenarioLoadClick = () => {
    setScenarioDialogMode('load');
    setScenarioDialogIsOpen(true);
  };

  const handleScenarioSaveClick = () => {
    setScenarioDialogMode('save');
    setScenarioDialogIsOpen(true);
  };

  const handleExportClick = index => {
    if (![0, 1].includes(index)) return;
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };

        //make sure the current dates are written to the DB
        let query = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/controls-list-param/submit`,
          {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
          { headers }
        );

        if (index === 0) {
          let timeseriesResults = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point/time-series-line`,
            {
              parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
            },
            { headers }
          );
          const { data: timeseriesData } = timeseriesResults;
          const timeseriesDataCsvString = [
            [`"Results for parameters: ${filters.parameters.join(', ')}"`],
            [`"Dates: ${filters.startDate} to ${filters.endDate}"`],
            [
              // 'Location Index',
              'Location ID',
              'Location Name',
              'Parameter',
              'Activity Date',
              'Data Value',
              'Units',
              'Source',
              'Organization',
            ],
            ...timeseriesData.map(item => [
              // item.location_index,
              item.location_id,
              item.location_name.replaceAll(',', '.'),
              item.parameter_abbrev,
              item.activity_date,
              item.data_value,
              item.units,
              item.source,
              item.org_name,
            ]),
          ]
            .map(e => e.join(','))
            .join('\n');

          var a = document.createElement('a');
          a.href = 'data:attachment/csv,' + encodeURIComponent(timeseriesDataCsvString);
          a.target = '_blank';
          a.download = `Time Series Data (${filters.startDate} - ${filters.endDate}).csv`;
          document.body.appendChild(a);
          a.click();
          // return csvString;
        }

        if (index === 1) {
          let tableResults = await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point/table`,
            {
              parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
            },
            { headers }
          );
          const { data: tableData } = tableResults;
          const tableDataCsvString = [
            [`"Results for parameters: ${filters.parameters.join(', ')}"`],
            [`"Dates: ${filters.startDate} to ${filters.endDate}"`],
            [
              'Location ID',
              'Location Name',
              'Parameter',
              'Units',
              'Count of Results (Statistics)',
              '85th or 15th percentile',
              'Benchmark Classification: 85th/15th',
              'Median',
              'Benchamrk Classification: Median',
              'Analysis Period (Statistics)',
              'Benchmark 0-1',
              'Benchmark 1-2',
              'Benchmark 2-3',
              'Benchmark 3-4',
              'Trend (all data)',
              'Source',
              'Organizations',
            ],
            ...tableData.map(item => [
              item.location_id,
              item.location_name.replaceAll(',', '.'),
              item.parameter_abbrev,
              item.units,
              item.recordcount,
              item.stat_85,
              item.bval_85,
              item.stat_median,
              item.bval_median,
              item.analysis_period,
              item.bmk_0_1,
              item.bmk_1_2,
              item.bmk_2_3,
              item.bmk_3_4,
              item.trend,
              item.source,
              item.organizations.replaceAll(',', '.'),
            ]),
          ]
            .map(e => e.join(','))
            .join('\n');

          var a = document.createElement('a');
          a.href = 'data:attachment/csv,' + encodeURIComponent(tableDataCsvString);
          a.target = '_blank';
          a.download = `Stats & Benchmarks Data (${filters.startDate} - ${filters.endDate}).csv`;
          document.body.appendChild(a);
          a.click();
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }
    send();
  };

  useEffect(() => {
    if (startDate && endDate) {
      setFilters(prevState => {
        return {
          ...prevState,
          ['startDate']: startDate,
          ['endDate']: endDate,
        };
      });
    }
  }, [startDate, endDate]);

  const getPriorityIndexByName = name => {
    let priority = priorities.find(x => x.priority_desc === name);
    return priority?.priority_index;
  };
  const getThreatIndexByName = name => {
    let threat = threats.find(x => x.threat_desc === name);
    return threat?.threat_index;
  };
  const getParameterIndexByName = name => {
    let parameter = parameters.find(x => x.parameter_abbrev === name);
    if (typeof parameter === 'undefined') {
      console.log(name + ' wasnt found... why?');
    }
    return parameter.parameter_index;
  };

  const [isControlsLoaded, setIsControlsLoaded] = useState(false);

  useEffect(() => {
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/controls-list-param/parameters`,
          {
            priorities: filters.priorities.map(x => getPriorityIndexByName(x)),
            threats: filters.threats.map(x => getThreatIndexByName(x)),
          },
          { headers }
        );
        setParameters(query.data);
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }
    send();
  }, [filters.priorities, filters.threats, isControlsLoaded]);

  useEffect(() => {
    if (priorities.length && threats.length) {
      setIsControlsLoaded(true);
    }
  }, [priorities, threats]);

  const [map, setMap] = useState();
  const [mapMoveEnd, setMapMoveEnd] = useState(false);
  const [kickoff, setKickoff] = useState();
  const [geometryData, setGeometryData] = useState();
  const [landUseData, setLandUseData] = useState();
  const [stationData, setStationData] = useState();
  const [parcelData, setParcelData] = useState();
  const [currentLocationData, setCurrentLocationData] = useState();
  const [queryAreaSize, setQueryAreaSize] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [analyticsResults, setAnalyticsResults] = useState(null);
  const [timeSeriesResults, setTimeSeriesResults] = useState(null);
  const [lastLocationId, setLastLocationId] = useState(null);
  const [monitoringPointData, setMonitoringPointData] = useState(null);
  const [renderedPointData, setRenderedPointData] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [activeZoomToLayerSpatialData, setActiveZoomToLayerSpatialData] = useState(null);
  const [activeBasemap, setActiveBasemap] = useState({
    name: 'Streets',
    styleURL: 'mapbox://styles/mapbox/streets-v11',
    //styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
  });
  const [basemapLayers] = useState(DummyBasemapLayers);
  const [
    myLayers,
    isLayersLoading, //eslint-disable-line
  ] = useFetchData('map-example/layers', []);
  const [
    parcelLayers,
    isParcelLayersLoading, //eslint-disable-line
  ] = useFetchData('map-example/layers/parcels', []);
  const [
    streamLayers,
    isStreamLayersLoading, //eslint-disable-line
  ] = useFetchData('map-example/layers/streams', []);

  const [layers, setLayers] = useState([]);
  const [filteredLayers, setFilteredLayers] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState([]);

  const [filterValues, setFilterValues] = useState({
    layerCategories: [],
    geometryTypes: [],
  });
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (!isLayersLoading && !isParcelLayersLoading && !isStreamLayersLoading) {
      setLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      setFilteredLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      setVisibleLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      console.log('setting visible layers', [...myLayers, ...parcelLayers, ...streamLayers]);
      onVisibleLayerChange([...myLayers, ...parcelLayers, ...streamLayers]);
    }
  }, [map, isLayersLoading, isParcelLayersLoading, isStreamLayersLoading]); //eslint-disable-line

  const [controls, setControls] = useState({
    drawer: {
      visible: checkControlOpen(sessionStorage.getItem('sk_drawer_control'), true),
    },
    basemap: {
      visible: checkControlOpen(sessionStorage.getItem('sk_basemap_control'), false),
    },
    layers: {
      visible: checkControlOpen(sessionStorage.getItem('sk_layers_control'), false),
    },
    filterLayers: {
      visible: checkControlOpen(sessionStorage.getItem('sk_filterLayers_control'), false),
    },
    dataViz: {
      visible: false,
    },
    popup: {
      visible: checkControlOpen(sessionStorage.getItem('sk_popup_control'), true),
    },
    legend: {
      visible: checkControlOpen(sessionStorage.getItem('sk_legend_control'), true),
    },
  });

  useEffect(() => {
    if (searchValue !== '' || filterValues.geometryTypes.length !== 0 || filterValues.layerCategories.length !== 0) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [searchValue, filterValues]);

  useEffect(() => {
    if (searchValue === '' && filterValues.geometryTypes.length === 0 && filterValues.layerCategories === 0) {
      setFilteredLayers(layers);
    } else {
      let filteredByChips = [...layers];

      if (filterValues.geometryTypes.length > 0) {
        filteredByChips = filteredByChips.filter(layer => filterValues.geometryTypes.includes(layer.geometry_type_ndx));
      }

      if (filterValues.layerCategories.length > 0) {
        filteredByChips = filteredByChips.filter(layer => {
          return filterValues.layerCategories.some(r => layer.layer_categories.includes(r));
        });
      }

      const filtered = matchSorter(filteredByChips, searchValue, {
        keys: ['name'],
      });
      setFilteredLayers(filtered);
    }
  }, [searchValue, layers, filterValues]); //eslint-disable-line

  const resetFilters = () => {
    setSearchValue('');
    setFilterValues({
      geometryTypes: [],
      layerCategories: [],
    });
  };

  const onSelectAllLayers = () => {
    setFilteredLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        if (filteredLayers.map(dd => dd.name).includes(d.name)) {
          rec.enabled = true;
          rec.visible = true;
        }
        return rec;
      });
      return newValues;
    });
  };

  const onSelectNoneLayers = () => {
    setFilteredLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        if (filteredLayers.map(dd => dd.name).includes(d.name)) {
          rec.enabled = false;
          rec.visible = false;
        }
        return rec;
      });
      return newValues;
    });
  };

  const onSelectAllParameters = () => {
    setFilters(prevState => {
      return {
        ...prevState,
        ['parameters']: parameters.map(x => x.parameter_abbrev),
      };
    });
  };

  const onSelectNoneParameters = () => {
    setFilters(prevState => {
      return {
        ...prevState,
        ['parameters']: [],
      };
    });
  };

  const handleControlsVisibility = (control, state) => {
    setControls(prevState => {
      let newValues = { ...prevState };

      if (typeof state === 'undefined' || state === null) {
        sessionStorage.setItem(`sk_${control}_control`, !newValues[control].visible);

        if (control === 'basemap' && !newValues.basemap.visible) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === 'layers' && !newValues.layers.visible) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }

        newValues[control].visible = !newValues[control].visible;
      } else {
        sessionStorage.setItem(`sk_${control}_control`, state);
        newValues[control].visible = state;

        if (control === 'basemap' && state === true) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === 'layers' && state === true) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }
      }
      return newValues;
    });
  };

  const cleanParams = params => {
    const newParams = [];

    parameters.forEach(x => {
      if (params.indexOf(x.parameter_abbrev) !== -1) {
        newParams.push(x.parameter_abbrev);
      }
    });

    return newParams;
  };

  const handleFilters = (name, value, simpleMode = false) => {
    if (name !== 'analysisType' && simpleMode === false) {
      // toggle only this one on/off
      setFilters(prevState => {
        const existingVals = [...prevState[name]];
        const existingIndex = existingVals.indexOf(value);
        existingIndex > -1 ? existingVals.splice(existingIndex, 1) : existingVals.push(value);

        return {
          ...prevState,
          [name]: existingVals,
        };
      });
    } else {
      // toggle all off and then toggle this one
      setFilters(prevState => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  const handleControlsSubmit = () => {
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/controls-list-param/submit`,
          {
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
          { headers }
        );

        fetchMonitoringPointData();
        fetchLandUseData();
        fetchStationData();
        fetchParcelData();
        fetchAnalyticsTableForLocation();
        fetchAnalyticsTimeSeriesForLocation();
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }
    send();
  };

  function fetchAnalyticsTableForLocation(location_index) {
    if (!location_index) location_index = lastLocationId;
    if (!location_index) return;

    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point/table/${location_index}`,
          {
            parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
          },
          { headers }
        );

        setAnalyticsResults(results.reverse());
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }

    send();
  }

  function fetchAnalyticsTimeSeriesForLocation(location_index) {
    if (!location_index) location_index = lastLocationId;
    if (!location_index) return;

    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: line } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point/time-series-line/${location_index}`,
          {
            parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
          },
          { headers }
        );

        const { data: bar } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point/time-series-bar/${location_index}`,
          {
            parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
          },
          { headers }
        );

        setTimeSeriesResults({
          line: line,
          bar: bar,
        });
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }

    send();
  }

  useEffect(() => {
    fetchMonitoringPointData();
    fetchAnalyticsTableForLocation();
    fetchAnalyticsTimeSeriesForLocation();
  }, [filters.parameters, filters.analysisType]);

  useEffect(() => {
    if (filters.parameters.length && parameters.length) {
      console.log('INITIAL LOAD_----------------');
      fetchMonitoringPointData();
      fetchLandUseData();
      fetchStationData();
      fetchParcelData();
    }
  }, [kickoff, parameters, filters.parameters]);

  useEffect(() => {
    if (filters.parameters.length && parameters.length) {
      setFilters(prevState => {
        return {
          ...prevState,
          ['parameters']: cleanParams(filters.parameters),
        };
      });
    }
  }, [parameters]);

  useEffect(() => {
    fetchLandUseData();
    fetchStationData();
    fetchParcelData();
  }, [geometryData]);

  const fetchMonitoringPointData = () => {
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/monitoring-point`,
          {
            parameters: cleanParams(filters.parameters).map(x => getParameterIndexByName(x)),
          },
          { headers }
        );
        setMonitoringPointData(query.data);
        updateRenderedPoints(query.data);
        recolorPointsForLayers(query.data);
        // fetchAnalyticsTableForLocation();
        // fetchAnalyticsTimeSeriesForLocation()
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }
    send();
  };

  // const debouncedUpdate = useCallback(debounce(() => {
  //   updateRenderedPoints(monitoringPointData);
  // },1000), [monitoringPointData]);
  //
  // const [oneTime, setOneTime] = useState(false);
  //
  // useLayoutEffect(() => {
  //   if (kickoff && monitoringPointData.length && !oneTime) {
  //     map.on('moveend', debouncedUpdate);
  //     setOneTime(true);
  //   } else if (kickoff && monitoringPointData.length) {
  //     map.off('moveend', debouncedUpdate);
  //     setOneTime(false);
  //   }
  // }, [kickoff, monitoringPointData, oneTime]);

  const updateRenderedPoints = myData => {
    if (myData === null || typeof myData === 'undefined') {
      myData = monitoringPointData;
    }

    const locationValues = {};
    const parameterValues = {};

    myData.forEach(row => {
      // set a default score
      if (typeof locationValues[row.location_index] === 'undefined') {
        locationValues[row.location_index] = 0;
      }

      if (filters.analysisType === '85th percentile') {
        if (row.all_85_bmk > locationValues[row.location_index]) {
          locationValues[row.location_index] = row.all_85_bmk;
        }
      } else {
        if (row.all_med_bmk > locationValues[row.location_index]) {
          locationValues[row.location_index] = row.all_med_bmk;
        }
      }

      // set a default score
      if (typeof parameterValues[row.location_index] === 'undefined') {
        parameterValues[row.location_index] = [];
      }
      if (parameterValues[row.location_index].indexOf(row.parameter_abbrev) === -1) {
        parameterValues[row.location_index].push(row.parameter_abbrev);
      }
    });

    let features = map.queryRenderedFeatures({
      layers: [
        'Stream Stations',
        'Reservoir Stations',
        'Effluent Stations',
        'Mine Discharge Stations',
        'Spring Stations',
        'Groundwater Stations',
      ],
      filter: ['match', ['get', 'location_i'], Object.keys(locationValues).map(x => parseInt(x)), true, false],
    });

    features = features.map(x => {
      return {
        ...x,
        score: locationValues[x.properties.location_i],
        parameters: parameterValues[x.properties.location_i],
      };
    });

    features.sort((a, b) => (a.score < b.score ? 1 : b.score < a.score ? -1 : 0));

    setRenderedPointData(features);
  };

  const [isLandUseDataLoading, setIsLandUseDataLoading] = useState(false);
  const [isMonitoringLocationDataLoading, setIsMonitoringLocationDataLoading] = useState(false);
  const [isParcelDataLoading, setIsParcelDataLoading] = useState(false);

  const fetchLandUseData = () => {
    setIsLandUseDataLoading(true);
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/user-geometry/landuse`, { headers });
        setLandUseData(query.data);
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      } finally {
        setIsLandUseDataLoading(false);
      }
    }
    send();
  };

  const fetchStationData = () => {
    setIsMonitoringLocationDataLoading(true);
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/user-geometry/stations`, { headers });
        setStationData(query.data);
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      } finally {
        setIsMonitoringLocationDataLoading(false);
      }
    }
    send();
  };

  const fetchParcelData = () => {
    setIsParcelDataLoading(true);
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        let query = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/user-geometry/parcels`, { headers });
        setParcelData(query.data);
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      } finally {
        setIsParcelDataLoading(false);
      }
    }
    send();
  };

  const getHexColorForScore = score => {
    switch (score) {
      case 4:
        return '#c61717';
      case 3:
        return '#f9a825';
      case 2:
        return '#ffeb3b';
      case 1:
        return '#16f465';
      case 0:
        return '#228044';
      default:
        return '#999999';
    }
  };

  const recolorPointsForLayers = (data = null) => {
    const layerIds = [
      'Stream Stations',
      'Reservoir Stations',
      'Effluent Stations',
      'Mine Discharge Stations',
      'Spring Stations',
      'Groundwater Stations',
    ];

    if (data === null) {
      data = monitoringPointData;
    }
    if (data === null) {
      return;
    }
    // sort by location_index ascending
    data.sort((a, b) => (a.location_index > b.location_index ? 1 : b.location_index > a.location_index ? -1 : 0));

    const colorData = [];
    const locationValues = {};

    data.forEach(row => {
      // set a default score
      if (typeof locationValues[row.location_index] === 'undefined') {
        locationValues[row.location_index] = 0;
      }

      if (filters.analysisType === '85th percentile') {
        if (row.all_85_bmk > locationValues[row.location_index]) {
          locationValues[row.location_index] = row.all_85_bmk;
        }
      } else {
        if (row.all_med_bmk > locationValues[row.location_index]) {
          locationValues[row.location_index] = row.all_med_bmk;
        }
      }
    });

    for (const [loc_id, score] of Object.entries(locationValues)) {
      colorData.push(parseInt(loc_id));
      colorData.push(getHexColorForScore(score));
    }

    layerIds.forEach(id => {
      map.setFilter(id, [
        'match',
        ['get', 'location_i'],
        Object.keys(locationValues).map(x => parseInt(x)),
        true,
        false,
      ]);

      map.setFilter(id + '-labels', [
        'match',
        ['get', 'location_i'],
        Object.keys(locationValues).map(x => parseInt(x)),
        true,
        false,
      ]);

      map.setPaintProperty(id, 'circle-opacity', 1);
      map.setPaintProperty(id, 'circle-stroke-opacity', 1);
      map.setPaintProperty(id, 'circle-color', ['interpolate', ['linear'], ['get', 'location_i'], ...colorData]);
    });
  };

  useEffect(() => {
    console.log('parameters changed to', parameters);
  }, [parameters]);

  const onMapChange = val => setMap(val);
  const onBasemapChange = val => {
    setActiveBasemap(val);
  };
  const onZoomToLayerChange = val => setActiveZoomToLayerSpatialData(val);
  const onLayerChange = val => setLayers(val);
  const onFilteredLayerChange = val => setFilteredLayers(val);
  const onVisibleLayerChange = val => setVisibleLayers(val);
  const onFilterValuesChange = (name, val) => {
    setFilterValues(prevState => {
      let newValues = { ...prevState };
      let filterVals = [...newValues[name]];
      const existingIndex = filterVals.indexOf(val);
      if (existingIndex === -1) {
        filterVals.push(val);
      } else {
        filterVals.splice(existingIndex, 1);
      }
      newValues[name] = filterVals;
      return newValues;
    });
  };
  const onSearchValueChange = val => setSearchValue(val);

  const updateVisibleLayers = layers => {
    setFilteredLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.visible = false;
        rec.enabled = false;

        layers.forEach(layer => {
          if (rec.id === layer) {
            rec.visible = true;
            rec.enabled = true;
          }
        });

        return rec;
      });
      return newValues;
    });
    setVisibleLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        rec.visible = false;
        rec.enabled = false;

        layers.forEach(layer => {
          if (rec.id === layer) {
            rec.visible = true;
            rec.enabled = true;
          }
        });

        return rec;
      });
      return newValues;
    });
    setLayers(prevState => {
      let newValues = [...prevState].map(d => {
        let rec = { ...d };
        if (filteredLayers.map(dd => dd.name).includes(d.name)) {
          rec.visible = false;
          rec.enabled = false;

          layers.forEach(layer => {
            if (rec.id === layer) {
              rec.visible = true;
              rec.enabled = true;
            }
          });
        }
        return rec;
      });
      return newValues;
    });
  };

  const updateEnabledLayers = layers => {
    if (!layers || layers.length === 0) return;
    setFilteredLayers(prevState => {
      return [...prevState].map(d => {
        let rec = { ...d };
        layers.forEach(layer => {
          if (rec.id === layer) {
            rec.enabled = true;
          }
        });
        return rec;
      });
    });
    setVisibleLayers(prevState => {
      return [...prevState].map(d => {
        let rec = { ...d };
        layers.forEach(layer => {
          if (rec.id === layer) {
            rec.enabled = true;
          }
        });
        return rec;
      });
    });
    setLayers(prevState => {
      return [...prevState].map(d => {
        let rec = { ...d };
        if (filteredLayers.map(dd => dd.name).includes(d.name)) {
          layers.forEach(layer => {
            if (rec.id === layer) {
              rec.enabled = true;
            }
          });
        }
        return rec;
      });
    });
  };

  return (
    <MapContext.Provider
      value={{
        map,
        mapMode,
        setMapMode,
        mapMoveEnd,
        setMapMoveEnd,
        setMap,
        kickoff,
        setKickoff,
        geometryData,
        setGeometryData,
        landUseData,
        stationData,
        parcelData,
        controls,
        activeZoomToLayerSpatialData,
        activeBasemap,
        basemapLayers,
        filters,
        setFilters,
        analysisTypes,
        priorities,
        threats,
        parameters,
        layers,
        filteredLayers,
        visibleLayers,
        filterValues,
        searchValue,
        filterActive,
        queryAreaSize,
        setQueryAreaSize,
        queryResults,
        setQueryResults,
        analyticsResults,
        setAnalyticsResults,
        setTimeSeriesResults,
        timeSeriesResults,
        setLastLocationId,
        monitoringPointData,
        renderedPointData,
        currentLocationData,
        setCurrentLocationData,
        scenarioDialogIsOpen,
        setScenarioDialogIsOpen,
        scenarioData,
        scenarioDialogMode,
        fetchedGeometryData,
        setWaitingState,
        snackbarOpen,
        snackbarError,
        snackbarSuccessMessage,
        snackbarErrorMessage,
        isLandUseDataLoading,
        isMonitoringLocationDataLoading,
        isParcelDataLoading,
        updateVisibleLayers,
        updateEnabledLayers,
        setSnackbarMessage,
        handleSnackbarClose,
        triggerLoadGeometryData,
        handleRefresh,
        handleScenarioLoadClick,
        handleScenarioSaveClick,
        handleExportClick,
        updateRenderedPoints,
        getHexColorForScore,
        fetchAnalyticsTableForLocation,
        fetchAnalyticsTimeSeriesForLocation,
        handleFilters,
        handleControlsVisibility,
        onMapChange,
        onZoomToLayerChange,
        onBasemapChange,
        onLayerChange,
        onFilteredLayerChange,
        onVisibleLayerChange,
        onFilterValuesChange,
        onSearchValueChange,
        resetFilters,
        onSelectAllLayers,
        onSelectNoneLayers,
        onSelectAllParameters,
        onSelectNoneParameters,
        handleControlsSubmit,
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
