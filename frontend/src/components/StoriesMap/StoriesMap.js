import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '../../hooks/useAuth0';
import axios from 'axios';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import ResetZoomControl from '../ResetZoomControl';

import PopupControl from '../PopupControl';
import LegendControl from '../LegendControl';
import DataVizControl from '../DataVizControl/DataVizControl';
import useFetchData from '../../hooks/useFetchData';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// create page styles
const useStyles = makeStyles(theme => ({
  map: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 64px - 64px)',
    '& .mapboxgl-canvas-container:focus, & .mapboxgl-canvas:focus': {
      outline: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  startDrawingBtn: {},
  propTable: {
    borderRadius: '5px',
    borderCollapse: 'collapse',
    border: '1px solid #ccc',
    '& td': {
      padding: '3px 6px',
      margin: 0,
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#eee',
    },
    '& tr': {
      borderRadius: '5px',
    },
  },
  popupIcon: {
    width: '60px',
    height: '60px',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    textAlign: 'center',
    margin: '10px auto',
    color: 'white',
    lineHeight: '87px',
  },
  popupWrap: {
    maxHeight: 400,
    overflowY: 'scroll',
  },
}));

const StoriesMap = ({
  drawerVisible,
  waterYear,
  startMonth,
  endMonth,
  setHydrographData,
  setTableStatsData,
  setTableStatsInfo,
  setGradientData,
  setDataVizVisible,
  gradientData,
  setIsDataLoading,
  dataVizVisible,
  setIsTableStatsDataNull,
  setIsHydrographDataNull,
  lastLocationNdx,
  setLastLocationNdx,
}) => {
  const classes = useStyles();

  const { getTokenSilently } = useAuth0();

  const mapContainer = useRef(null); // create a reference to the map container

  const [map, setMap] = useState();
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [layersAreLoaded, setLayersAreLoaded] = useState(false);

  //track visibility of side legend to toggle
  const [legendVisible, setLegendVisible] = useState(true);

  const [popupVisible, setPopupVisible] = useState(true);

  //data results
  //static layers array to be rendered to map
  const [
    myLayers,
    isLayersLoading, //eslint-disable-line
  ] = useFetchData('map-example/stories-layers', []);

  function fetchGradientData(year, endMonth) {
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/usgs/gradient/`,
          {
            properties: {
              year,
              endMonth,
            },
          },
          { headers }
        );
        console.log('Gradient Data: ', results);

        setGradientData(results);
        recolorPointsForLayers(results);
      } catch (err) {
        console.error(err);
      }
    }
    send();
  }

  const getHexColorForGradient = pctnorm_num => {
    switch (true) {
      case pctnorm_num >= 140:
        return '#000087';
      case pctnorm_num >= 120 && pctnorm_num < 140:
        return '#A8D1DF';
      case pctnorm_num >= 80 && pctnorm_num < 120:
        return '#008140';
      case pctnorm_num >= 60 && pctnorm_num < 80:
        return '#F76300';
      case pctnorm_num < 60:
        return '#E20000';
      default:
        return '#fff';
    }
  };

  const recolorPointsForLayers = (data = null) => {
    if (data === null) {
      data = gradientData;
    }
    if (data === null) {
      return;
    }

    // sort by station_ndx ascending
    data.sort((a, b) => (a.station_ndx > b.station_ndx ? 1 : b.station_ndx > a.station_ndx ? -1 : 0));

    const colorData = [];
    const siteIndexes = {};

    data.forEach(row => {
      // set a default score
      if (typeof siteIndexes[row.station_ndx] === 'undefined') {
        siteIndexes[row.station_ndx] = 0;
      }

      siteIndexes[row.station_ndx] = row.pctnorm_num;
    });

    for (const [location_index, pctnorm_num] of Object.entries(siteIndexes)) {
      colorData.push(parseInt(location_index));
      colorData.push(getHexColorForGradient(pctnorm_num));
    }

    map.setFilter('USGS Streamflow Stations', [
      'match',
      ['get', 'site_ndx'],
      Object.keys(siteIndexes).map(x => parseInt(x)),
      true,
      false,
    ]);

    //if the map ever renders no dots, this will make them visible again the next render
    map.setLayoutProperty('USGS Streamflow Stations', 'visibility', 'visible');

    map.setPaintProperty('USGS Streamflow Stations', 'circle-opacity', 1);
    map.setPaintProperty('USGS Streamflow Stations', 'circle-stroke-opacity', 1);
    map.setPaintProperty('USGS Streamflow Stations', 'circle-color', [
      'interpolate',
      ['linear'],
      ['get', 'site_ndx'],
      ...colorData,
    ]);

    if (!map.getLayer(`USGS Streamflow Stations-labels`)) {
      map.addLayer({
        id: 'USGS Streamflow Stations-labels',
        type: 'symbol',
        source: 'USGS Streamflow Stations-source',
        'source-layer': 'USGS_StreamflowStations-5qor4i',
        minzoom: 10,
        layout: {
          'text-field': ['get', 'site_desc'],
          'text-offset': [0, -2],
          'text-size': 14,
        },
        paint: {
          'text-halo-color': '#ffffff',
          'text-halo-width': 0.5,
        },
      });
      console.log(Object.keys(siteIndexes));

      map.setFilter('USGS Streamflow Stations-labels', [
        'match',
        ['get', 'site_ndx'],
        Object.keys(siteIndexes).map(x => parseInt(x)),
        true,
        false,
      ]);
    }
  };

  function fetchHydrographData(year, startMonth, endMonth, station_ndx) {
    async function send() {
      setIsDataLoading(true);
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/usgs/hydrograph/`,
          {
            properties: {
              year,
              startMonth,
              endMonth,
              station_ndx,
            },
          },
          { headers }
        );
        console.log('Hydrograph Data: ', results);
        if (results.length === 0) {
          setIsHydrographDataNull(true);
          setIsDataLoading(false);
          setHydrographData([]);
          return;
        } else {
          setIsHydrographDataNull(false);
          setHydrographData(results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsDataLoading(false);
      }
    }
    send();
  }

  function fetchTableStatsData(year, endMonth, station_ndx) {
    async function send() {
      setIsDataLoading(true);
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/usgs/tablestats-data/`,
          {
            properties: {
              year,
              endMonth,
              station_ndx,
            },
          },
          { headers }
        );
        console.log('Table Stats Data: ', results[0]);
        if (results.length === 0) {
          setIsTableStatsDataNull(true);
          setIsDataLoading(false);
          setTableStatsData([]);
          return;
        } else {
          setIsTableStatsDataNull(false);
          setTableStatsData(results[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsDataLoading(false);
      }
    }
    send();
  }

  function fetchTableStatsInfo() {
    async function send() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/usgs/tablestats-info/`, {
          headers,
        });

        const indexedResults = {};

        results.forEach(row => {
          indexedResults[row.station_ndx] = { ...row };
        });
        console.log('table stats info: ', indexedResults);
        setTableStatsInfo(indexedResults);
      } catch (err) {
        console.error(err);
      } finally {
      }
    }
    send();
  }

  /**
   * create the map on page load and
   * add a simple zoom control
   */
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-106.64425246096249, 39.62037385121381],
      zoom: 9,
      scrollZoom: true,
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.addControl(new ResetZoomControl(), 'top-left');

    //tracks when map is fully created so the next action can take place (add the layers)
    map.on('load', () => {
      setMapIsLoaded(true);
    });

    fetchTableStatsInfo();
    setMap(map);
  }, []); //eslint-disable-line

  //when drawer is toggled, it resizes the map instead of just sliding it
  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null) {
      setTimeout(() => {
        map.resize();
      }, 500);
    }
  }, [drawerVisible, map]);

  /**
   * add the mapbox sources
   * add the mapbox layers to the map
   */
  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null && mapIsLoaded && map.isStyleLoaded()) {
      myLayers
        .sort((a, b) => (a.drawOrder > b.drawOrder ? 1 : -1))
        .map(layer => {
          if (!map.getSource(`${layer.name}-source`) && layer.paint !== null) {
            if (layer.source.type === 'vector') {
              map.addSource(`${layer.name}-source`, {
                type: 'vector',
                lineMetrics: true,
                url: layer.source.url,
              });
            }

            const newLayer = {
              id: layer.name,
              interactive: true,
              type: layer.geometry_type,
              source: `${layer.name}-source`,
              layout: {
                visibility: layer.visible ? 'visible' : 'none',
              },
              paint: layer.paint,
            };

            if (layer.source.type === 'vector') {
              newLayer['source-layer'] = layer.source.id;
            }

            map.addLayer(newLayer);
          }
          return layer;
        });

      //tracks when layers are loaded into the map so the next action can take place
      map.on('idle', () => {
        setLayersAreLoaded(true);
      });
    }
  }, [mapIsLoaded]);

  /**
   * fetches all of the data relevant to coloring the points on the map after layers are loaded or when the waterYear or endMonth changes
   */
  useEffect(() => {
    if (layersAreLoaded) {
      fetchGradientData(waterYear.wateryear, endMonth.watermonth);
    }
  }, [layersAreLoaded, waterYear, endMonth]);

  //renders a popup for the point that is clicked
  useEffect(() => {
    if (map && mapIsLoaded) {
      //event listeners
      map.off('click', setupPopups);
      map.on('click', setupPopups);

      map.on('mousemove', function(e) {
        const bbox = [
          [e.point.x, e.point.y],
          [e.point.x, e.point.y],
        ];
        const features = map.queryRenderedFeatures(bbox, { layers: ['USGS Streamflow Stations'] });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      });

      function setupPopups(e) {
        //queryRenderedFeatures is a mapbox function
        const pointFeatures = map.queryRenderedFeatures(e.point);

        if (pointFeatures.length) {
          map.fire('closeAllPopups');

          let layer = myLayers.filter(x => x.name === pointFeatures[0].layer.id)[0];

          //sets the name of the last location that was clicked

          const popup = new mapboxgl.Popup({ closeOnClick: false, maxWidth: '400px' }).setLngLat(e.lngLat);

          let hasPopup = true;

          if (layer && layer.popupType === 'table') {
            map.flyTo({
              center: [pointFeatures[0].properties.site_lon, pointFeatures[0].properties.site_lat],
              zoom: 12,
              padding: { bottom: 200 },
            });

            setLastLocationNdx(pointFeatures[0].properties.site_ndx);
            setDataVizVisible(true);
            popup.setHTML(
              '<div class="' +
                classes.popupWrap +
                '"><h3>Properties</h3><table class="' +
                classes.propTable +
                '"><tbody>' +
                Object.entries(pointFeatures[0].properties)
                  .map(([k, v]) => {
                    if (k === 'hlink' || k === 'URL' || k === 'MoreInfo' || k === 'datacall') {
                      return `<tr><td><strong>${k}</strong></td><td><a href="${v}" target="_blank">Link</a></td></tr>`;
                    }
                    return `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`;
                  })
                  .join('') +
                '</tbody></table></div>'
            );
          } else {
            hasPopup = false;
          }

          if (hasPopup) popup.addTo(map);

          map.on('closeAllPopups', () => {
            popup.remove();
          });
        }
      }
    }
  }, [map, mapIsLoaded, myLayers]); //eslint-disable-line

  /**
   * fetches all of the data relevant to the Hydrograph whenever a point on the map is clicked if a location has been clicked, or the waterYear, endMonth, or startMonch changes
   * fetches all of the data relevant to the Table Data whenever a point on the map is clicked if a location has been clicked, or the waterYear, endMonth, or startMonch changes
   */
  useEffect(() => {
    if (lastLocationNdx != null) {
      fetchHydrographData(waterYear.wateryear, startMonth.watermonth, endMonth.watermonth, lastLocationNdx);

      fetchTableStatsData(waterYear.wateryear, endMonth.watermonth, lastLocationNdx);
    }
  }, [lastLocationNdx, waterYear, endMonth, startMonth]);

  return (
    <>
      <div className={classes.toolbar}></div>
      <div ref={mapContainer} className={classes.map}>
        <DataVizControl open={dataVizVisible} onClose={() => setDataVizVisible(!dataVizVisible)} />
        <PopupControl open={popupVisible} onClose={() => setPopupVisible(!popupVisible)} />
        <LegendControl open={legendVisible} onClose={() => setLegendVisible(!legendVisible)} />
      </div>
      {!popupVisible && (
        <div dangerouslySetInnerHTML={{ __html: '<style>.mapboxgl-popup { display: none; }</style>' }} />
      )}
      {!legendVisible && <div dangerouslySetInnerHTML={{ __html: '<style>.map-legend { display: none; }</style>' }} />}
    </>
  );
};

export default StoriesMap;
