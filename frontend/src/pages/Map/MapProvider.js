import React, { useState, useEffect, useContext } from 'react';
import matchSorter from "match-sorter";

import useFetchData from "../../hooks/useFetchData";

import StreetsImg from "../../images/streets.png";
import OutdoorsImg from "../../images/outdoors.png";
import SatelliteImg from "../../images/satellite.jpg";
import axios from 'axios';
import { useAuth0 } from '../../hooks/useAuth0';

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
  controls: {
  },
  activeZoomToLayer: {},
  activeBasemap: {},
  basemapLayers: [],
  layers: [],
  analysisTypes: [],
  priorities: [],
  threats: [],
  parameters: [],
  filters: {},
  filteredLayers: [],
  visibleLayers: [],
  filterValues: {},
  searchValue: "",
  filterActive: false,
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
  onSelectNoneLayers: () => {},
});

export const DummyBasemapLayers = [
  {
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
    image: StreetsImg,
  },
  {
    name: "Outdoors",
    styleURL: "mapbox://styles/mapbox/outdoors-v11",
    image: OutdoorsImg,
  },
  {
    name: "Satellite",
    styleURL: "mapbox://styles/mapbox/satellite-streets-v11",
    //styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
    image: SatelliteImg,
  },
];

/**
 * Utility function used to check if a the drawer is currently open
 * @param {*} val
 */
const checkControlOpen = (val, defaultVisibility = true) => {
  if (val === null || val === "undefined") {
    return defaultVisibility;
    //eslint-disable-next-line
  } else if (val == "true") {
    return true;
    //eslint-disable-next-line
  } else if (val == "false") {
    return false;
  }
};

/**
 * Create the context provider for the map context
 * @param {*} props
 */
export const MapProvider = (props) => {
  const { getTokenSilently } = useAuth0();

  const analysisTypes = [
    { value: "85", display: "85th percentile" },
    { value: "med", display: "Median" },
  ];

  // initialize the default sidebar filter values
  const [filters, setFilters] = useState({
    analysisType: "85th percentile",
    priorities: ["Treatment", "Infrastructure", "Environment"],
    threats: [
      "Agriculture",
      "Development",
      "Mining",
      "Natural",
      "OWTS",
      "Oil and Gas",
      "Recreation",
      "Transportation",
      "WWTPs",
      "Wildfire",
    ],
    parameters: [
      "NH3",
      "As-D",
      "As-T",
      "Cd-D",
      "Cd-T",
      "Cl",
      "Cu-D",
      "Cu-T",
      "DO",
      "E. coli",
      "Hardness",
      "Fe-D",
      "Fe-T",
      "Pb-D",
      "Pb-T",
      "Mn-D",
      "Mn-T",
      "Hg-T",
      "Mo-D",
      "Mo-T",
      "Ni-D",
      "Ni-T",
      "NO3",
      "NO3+NO2",
      "NO2",
      "pH",
      "TP",
      "Se-D",
      "Se-T",
      "Ag-D",
      "Ag-T",
      "SO4",
      "Temp",
      "Zn-D",
      "Zn-T",
      "Alk",
      "Turb",
      "Al-T",
      "U-T",
      "U-D",
      "Al-D",
      "TOC",
      "BR",
      "TSS",
      "F",
      "TN",
      "CSMR",
    ],
  });

  const [priorities] = useFetchData(`controls-list-param/priorities`);
  const [threats] = useFetchData(`controls-list-param/threats`);
  const [parameters, setParameters] = useState([]);

  const getPriorityIndexByName = (name) => {
    let priority = priorities.find(x => x.priority_desc === name);
    return priority?.priority_index;
  }
  const getThreatIndexByName = (name) => {
    let threat = threats.find(x => x.threat_desc === name);
    return threat?.threat_index;
  }
  const getParameterIndexByName = (name) => {
    let parameter = parameters.find(x => x.parameter_abbrev === name);
    return parameter.parameter_index;
  }

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
  const [geometryData, setGeometryData] = useState();
  const [queryAreaSize, setQueryAreaSize] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [activeZoomToLayer, setActiveZoomToLayer] = useState(null);
  const [activeBasemap, setActiveBasemap] = useState({
    name: "Streets",
    styleURL: "mapbox://styles/mapbox/streets-v11",
    //styleURL: "mapbox://styles/lrewater/ckfmqvtng6cad19r1wgf9acz8",
  });
  const [basemapLayers] = useState(DummyBasemapLayers);
  const [
    myLayers,
    isLayersLoading, //eslint-disable-line
  ] = useFetchData("map-example/layers", []);
  const [
    parcelLayers,
    isParcelLayersLoading, //eslint-disable-line
  ] = useFetchData("map-example/layers/parcels", []);
  const [
    streamLayers,
    isStreamLayersLoading, //eslint-disable-line
  ] = useFetchData("map-example/layers/streams", []);

  const [layers, setLayers] = useState([]);
  const [filteredLayers, setFilteredLayers] = useState([]);
  const [visibleLayers, setVisibleLayers] = useState([]);

  const [filterValues, setFilterValues] = useState({
    layerCategories: [],
    geometryTypes: [],
  });
  const [searchValue, setSearchValue] = useState("");


  useEffect(() => {
    if (!isLayersLoading && !isParcelLayersLoading && !isStreamLayersLoading) {
      setLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      setFilteredLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      setVisibleLayers([...myLayers, ...parcelLayers, ...streamLayers]);
      console.log('setting visible layers', [...myLayers, ...parcelLayers, ...streamLayers]);
      onVisibleLayerChange([...myLayers, ...parcelLayers, ...streamLayers])
    }
  }, [map, isLayersLoading, isParcelLayersLoading, isStreamLayersLoading]); //eslint-disable-line


  const [controls, setControls] = useState({
    drawer: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_drawer_control"),
        true
      ),
    },
    basemap: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_basemap_control"),
        false
      ),
    },
    layers: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_layers_control"),
        false
      ),
    },
    filterLayers: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_filterLayers_control"),
        false
      ),
    },
    dataViz: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_dataViz_control"),
        false
      ),
    },
    popup: {
      visible: checkControlOpen(
        sessionStorage.getItem("sk_popup_control"),
        true
      ),
    }
  });

  useEffect(() => {
    if (
      searchValue !== "" ||
      filterValues.geometryTypes.length !== 0 ||
      filterValues.layerCategories.length !== 0
    ) {
      setFilterActive(true);
    } else {
      setFilterActive(false);
    }
  }, [searchValue, filterValues]);

  useEffect(() => {
    if (
      searchValue === "" &&
      filterValues.geometryTypes.length === 0 &&
      filterValues.layerCategories === 0
    ) {
      setFilteredLayers(layers);
    } else {
      let filteredByChips = [...layers];

      if (filterValues.geometryTypes.length > 0) {
        filteredByChips = filteredByChips.filter((layer) =>
          filterValues.geometryTypes.includes(layer.geometry_type_ndx)
        );
      }

      if (filterValues.layerCategories.length > 0) {
        filteredByChips = filteredByChips.filter((layer) => {
          return filterValues.layerCategories.some((r) =>
            layer.layer_categories.includes(r)
          );
        });
      }

      const filtered = matchSorter(filteredByChips, searchValue, {
        keys: ["name"],
      });
      setFilteredLayers(filtered);
    }
  }, [searchValue, layers, filterValues]); //eslint-disable-line

  const resetFilters = () => {
    setSearchValue("");
    setFilterValues({
      geometryTypes: [],
      layerCategories: [],
    });
  };

  const onSelectAllLayers = () => {
    setFilteredLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = true;
        rec.visible = true;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        if (filteredLayers.map((dd) => dd.name).includes(d.name)) {
          rec.enabled = true;
          rec.visible = true;
        }
        return rec;
      });
      return newValues;
    });
  };

  const onSelectNoneLayers = () => {
    setFilteredLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setVisibleLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        rec.enabled = false;
        rec.visible = false;
        return rec;
      });
      return newValues;
    });
    setLayers((prevState) => {
      let newValues = [...prevState].map((d) => {
        let rec = { ...d };
        if (filteredLayers.map((dd) => dd.name).includes(d.name)) {
          rec.enabled = false;
          rec.visible = false;
        }
        return rec;
      });
      return newValues;
    });
  };

  const handleControlsVisibility = (control, state) => {
    setControls((prevState) => {
      let newValues = { ...prevState };

      if (typeof state === "undefined" || state === null) {
        sessionStorage.setItem(
          `sk_${control}_control`,
          !newValues[control].visible
        );

        if (control === "basemap" && !newValues.basemap.visible) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === "layers" && !newValues.layers.visible) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }

        newValues[control].visible = !newValues[control].visible;
      } else {
        sessionStorage.setItem(`sk_${control}_control`, state);
        newValues[control].visible = state;

        if (control === "basemap" && state === true) {
          newValues.layers.visible = false;
          sessionStorage.setItem(`sk_layers_control`, false);
        }

        if (control === "layers" && state === true) {
          newValues.basemap.visible = false;
          sessionStorage.setItem(`sk_basemap_control`, false);
        }
      }
      return newValues;
    });
  };

  const handleFilters = (name, value) => {
    if (name !== "analysisType") { // toggle only this one on/off
      setFilters(prevState => {
        const existingVals = [...prevState[name]];
        const existingIndex = existingVals.indexOf(value);
        existingIndex > -1
          ? existingVals.splice(existingIndex, 1)
          : existingVals.push(value);

                return {
          ...prevState,
          [name]: existingVals,
        };
      });
    } else { // toggle all off and then toggle this one
      setFilters(prevState => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    }
  };

  const onMapChange = (val) => setMap(val);
  const onBasemapChange = (val) => {
    setActiveBasemap(val);
  };
  const onZoomToLayerChange = (val) => setActiveZoomToLayer(val);
  const onLayerChange = (val) => setLayers(val);
  const onFilteredLayerChange = (val) => setFilteredLayers(val);
  const onVisibleLayerChange = (val) => setVisibleLayers(val);
  const onFilterValuesChange = (name, val) => {
    setFilterValues((prevState) => {
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
  const onSearchValueChange = (val) => setSearchValue(val);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        geometryData,
        setGeometryData,
        controls,
        activeZoomToLayer,
        activeBasemap,
        basemapLayers,
        filters,
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
      }}
    >
      {props.children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);