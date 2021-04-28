import React, { useEffect, useRef, useContext, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0 } from '../../hooks/useAuth0';
import useFetchData from '../../hooks/useFetchData';
import axios from 'axios';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import BasemapControls from '../BasemapControl/BasemapControl';
import LayerControl from '../LayerControl/LayerControl';
import { MapContext, useMap } from '../../pages/Map/MapProvider';
import FiltersControls from '../FiltersControl/FiltersControl';
import DataVizControl from '../DataVizControl/DataVizControl';
import numbro from 'numbro';
import { Typography } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Flex from '../Flex/Flex';
import Box from '@material-ui/core/Box';
import FreehandMode from './FreehandMode';
import InitiateDrawingControl from '../InitiateDrawingControl';
import PopupControl from '../PopupControl';
import ResetZoomControl from './ResetZoom';
import RoomIcon from '@material-ui/icons/Room';
import Button from '@material-ui/core/Button';

const turf = require('@turf/turf');

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

// create page styles
const useStyles = makeStyles((theme) => ({
  map: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 64px)',
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
  }
}));

const Map = ({
               setHasChanges,
               setShowQueryTooBigError,
               setLastQuerySize,
               handleRefresh,
             }) => {
  const classes = useStyles();
  const { getTokenSilently } = useAuth0();
  const {
    map,
    onMapChange,
    controls,
    handleControlsVisibility,
    basemapLayers,
    activeBasemap,
    activeZoomToLayer,
    onBasemapChange,
    filteredLayers,
    visibleLayers,
    onVisibleLayerChange,
    onFilteredLayerChange,
    onLayerChange,
    onZoomToLayerChange,
  } = useContext(MapContext);
  const mapProvider = useMap();
  const mapContainer = useRef(null); // create a reference to the map container
  const [draw, setDraw] = useState(new MapboxDraw({ // eslint-disable-line
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    modes: Object.assign(MapboxDraw.modes, {
      draw_polygon: FreehandMode,
    }),
  })); //eslint-disable-line
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const [mapPopups, setMapPopups] = useState([]);

  const [lastLocationIdClicked, setLastLocationIdClicked] = useState(null);

  /**
   * Load map geometry from database
   */
  const [
    geometryData,
    setGeometryData,
  ] = useState([]);

  /**
   * create the map on page load and
   * add a simple zoom control
   */
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: activeBasemap.styleURL,
      center: [-106.64425246096249, 39.62037385121381],
      zoom: 9,
      scrollZoom: true,
    });

    mapProvider.setMap(map);

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');
    map.addControl(draw, 'top-left');
    map.addControl(new ResetZoomControl(), 'top-left');

    map.on('load', () => {
      setMapIsLoaded(true);
      processQueryResults();
    });

    map.on('draw.create', () => {
      removeExistingDrawings();
      updateDrawings();
    });
    map.on('draw.delete', updateDrawings);
    map.on('draw.update', updateDrawings);

    map.on('click', setupPopups);
    map.on('zoom', updateZoomViz);

    function updateZoomViz(e) {
      visibleLayers.map(layer => {
        //map.setLayoutProperty(layer.name, 'visibility', 'visible');
        if (layer.minzoom && map.getZoom() < layer.minzoom) {
          map.setLayoutProperty(layer.name, 'visibility', 'none');
        }
        if (layer.maxzoom && map.getZoom() > layer.maxzoom) {
          map.setLayoutProperty(layer.name, 'visibility', 'none');
        }
        return layer;
      });
    }

    function setupPopups(e) {
      const pointFeatures = map.queryRenderedFeatures(e.point);
      // .filter(layer => layer.layer.id.includes('All Wells'));
      const isDrawing = draw.getMode().startsWith('draw');
      if (pointFeatures.length && !pointFeatures[0].source.startsWith('mapbox-gl-draw') && !isDrawing) {
        map.fire('closeAllPopups');

        let layer = visibleLayers.filter(x => x.name === pointFeatures[0].layer.id)[0];
        const popup = new mapboxgl.Popup({ closeOnClick: false, maxWidth: '300px' })
          .setLngLat(e.lngLat);

        console.log('lngLat',e.lngLat);
        console.log('point',e.point);
        console.log('pointFeatures',pointFeatures);
        console.log(layer);
        let hasPopup = true;

        if (layer && layer.popupType === 'point') {
          let data = pointFeatures[0].properties;

          let icon = document.createElement('div');
          ReactDOM.render(<RoomIcon fontSize={"large"}/>, icon);

          let heading = document.createElement('div');
          ReactDOM.render(<Typography variant={'h5'} align={'center'}>{data.location_1}</Typography>, heading);

          let subheading = document.createElement('div');
          ReactDOM.render(<Typography variant={'subtitle1'} align={'center'} color={'textSecondary'}>({data.loc_type})</Typography>, subheading);

          let body = document.createElement('div');
          ReactDOM.render(<Typography variant={'body1'} align={'center'}>{data.location_n}</Typography>, body);

          popup.setLngLat({lng: data.loc_long, lat: data.loc_lat});

          popup.setHTML(
            '<div class="' + classes.popupIcon + '"> ' + icon.innerHTML + '</div>' +
            heading.innerHTML +
            subheading.innerHTML +
            body.innerHTML
          );

          setLastLocationIdClicked(pointFeatures[0].properties.location_i);

          mapProvider.handleControlsVisibility('dataViz', true);
          map.flyTo({ center: [pointFeatures[0].properties.loc_long, pointFeatures[0].properties.loc_lat], zoom: 12});
        } else {
          popup.setHTML(
            '<h3>Properties</h3><table class="' + classes.propTable + '"><tbody>' +
            Object.entries(pointFeatures[0].properties).map(([k, v]) => {
              if (k === 'hlink' || k === 'URL') {
                return `<tr><td><strong>${k}</strong></td><td><a href="${v}" target="_blank">DNR Link</a></td></tr>`;
              }
              return `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`;
            }).join('') +
            '</tbody></table>',
          );
        }

        /*if (layer && layer.popupType && layer.popupType === 'section') {
          popup.setHTML(
            '<h3>Section: ' + pointFeatures[0].properties['SECTION_'] + '</h3>' +
            '<p>Township ' + pointFeatures[0].properties['TWNSHP'] + pointFeatures[0].properties['DIR'] + ', Range ' +
            pointFeatures[0].properties['RNG']
          );
        } else if (layer && layer.popupType && layer.popupType === 'transects') {
            popup.setHTML(
              '<h3>Transect ' + pointFeatures[0].properties['xsect'] + ', ' + pointFeatures[0].properties['Study_Area'] + '</h3>' +
              '<a href="' + pointFeatures[0].properties['Study_Area'] + '" target="_blank">View Cross Section Diagram</a>'
            );
        } else if (layer && layer.popupType && layer.popupType === 'streams') {
          popup.setHTML(
            '<h3>' + pointFeatures[0].properties['GNIS_Name'] + '</h3>'
          );
        } else if (layer && layer.popupType && layer.popupType === 'nitrates') {
          popup.setHTML(
            '<h3>' + pointFeatures[0].properties['Contour'] + ' ppm</h3>'
          );
        } else if (layer && layer.popupType && layer.popupType === 'clay') {
          popup.setHTML(
            '<h3>' + pointFeatures[0].properties['Contour'] + ' Feet</h3>'
          );
        } else if (layer && layer.popupType && layer.popupType === 'waterlevels') {
          popup.setHTML(
            '<h3>' + pointFeatures[0].properties['Contour'] + '</h3> Ft ab MSL'
          );
        } else if (layer && layer.popupType && layer.popupType === 'sand') {
          popup.setHTML(
            '<h3>' + pointFeatures[0].properties['Contour'] + '</h3> Feet'
          );
        } else {
          popup.setHTML(
              '<h3>Properties</h3><table class="' + classes.propTable + '"><tbody>' +
              Object.entries(pointFeatures[0].properties).map(([k,v ]) => {
                if (k === 'hlink' || k === 'URL') {
                  return `<tr><td><strong>${k}</strong></td><td><a href="${v}" target="_blank">DNR Link</a></td></tr>`;
                }
                return `<tr><td><strong>${k}</strong></td><td>${v}</td></tr>`;
              }).join('') +
              '</tbody></table>'
            );
        }*/

        if (hasPopup) popup.addTo(map);

        map.on('closeAllPopups', () => {
          popup.remove();
        });
      }
    }

    function removeExistingDrawings() {
      const drawings = draw.getAll();
      const newId = drawings.features[drawings.features.length - 1].id;
      const pids = drawings.features.map(x => x.id).filter(x => x !== newId);
      draw.delete(pids);
    }

    function updateDrawings(e) {
      let data = draw.getAll();

      setShowQueryTooBigError(false);

      async function saveDrawings() {
        try {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/user-geometry`,
            { features: data.features },
            { headers },
          );
          setGeometryData(data.features);
        } catch (err) {
          // Is this error because we cancelled it ourselves?
          if (axios.isCancel(err)) {
            console.log(`call was cancelled`);
          } else {
            console.error(err);
          }
        }
      }

      const querySizeLimit = 1200000;
      const area = turf.area(data);
      if (parseInt(area / 4046.8564224) <= querySizeLimit) {
        //setHasChanges(true);
        saveDrawings();
      } else {
        const roundedArea = numbro(parseInt(area / 4046.8564224)).format({ thousandSeparated: true });
        setLastQuerySize(roundedArea);
        setShowQueryTooBigError(true);
      }
    }

    onMapChange(map);
  }, []); //eslint-disable-line


  useEffect(() => {
    mapProvider.setLastLocationId(lastLocationIdClicked);
    mapProvider.fetchAnalyticsTableForLocation(lastLocationIdClicked);
  }, [lastLocationIdClicked]);

  // useEffect(() => {
  //   let data = draw.getAll();
  //
  //   async function saveDrawings() {
  //     try {
  //       const token = await getTokenSilently();
  //       const headers = { Authorization: `Bearer ${token}` };
  //       await axios.put(
  //         `${process.env.REACT_APP_ENDPOINT}/api/user-geometry`,
  //         { features: data.features },
  //         { headers },
  //       );
  //       setGeometryData(data.features);
  //     } catch (err) {
  //       // Is this error because we cancelled it ourselves?
  //       if (axios.isCancel(err)) {
  //         console.log(`call was cancelled`);
  //       } else {
  //         console.error(err);
  //       }
  //     }
  //   }
  //
  //   saveDrawings();
  // }, [handleRefresh]);

  const handleStartDrawing = (e) => {
    draw.changeMode('draw_polygon');
  };

  useEffect(() => {
    //if (geometryData.length > 0 && mapIsLoaded) {
    draw.add(getFeatureGeometryObj(geometryData));
    //}
  }, [mapIsLoaded]); //eslint-disable-line

  useEffect(() => {
    mapProvider.setGeometryData(geometryData);
  }, [geometryData]); //eslint-disable-line

  useEffect(() => {
    if (mapIsLoaded) {
      processQueryResults();
    }
  }, [mapIsLoaded, geometryData, mapProvider.queryResults]); //eslint-disable-line

  /**
   * Update the map style whenever the activeBasemap
   * changes
   */
  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null && map.isStyleLoaded()) {
      map.setStyle(activeBasemap.styleURL);
      map.on('style.load', function() {
        visibleLayers.sort((a, b) => (a.drawOrder > b.drawOrder) ? 1 : -1).map((layer) => {
          if (
            !map.getSource(`${layer.name}-source`) &&
            layer.spatialData !== null &&
            layer.paint !== null
          ) {
            map.addSource(`${layer.name}-source`, {
              type: 'geojson',
              lineMetrics: true,
              data: layer.spatial_data,
            });

            map.addLayer({
              id: layer.name,
              type: layer.geometry_type,
              source: `${layer.name}-source`,
              // "source-layer": `${layer.name}-source`,
              layout: {
                visibility: layer.visible ? 'visible' : 'none',
              },
              paint: layer.paint,
            });
          }
          return layer;
        });

        visibleLayers.map((layer) => {
          if (
            map.getSource(`${layer.name}-source`) &&
            layer.spatialData !== null &&
            layer.paint !== null
          ) {
            map.getSource(`${layer.name}-source`).setData(layer.spatial_data);
            map.setLayoutProperty(
              layer.name,
              'visibility',
              layer.visible ? 'visible' : 'none',
            );
          }
          return layer;
        });
        console.log('style loaded');
      });
    }
  }, [activeBasemap, map]); //eslint-disable-line

  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null) {
      setTimeout(() => { map.resize(); }, 500);
    }
  }, [controls.drawer.visible, map]);

  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null && mapIsLoaded && visibleLayers.length > 0) {
      map.loadImage('/images/marker_wells.png', function(error, allWellsImg) {
          if (error) throw error;
          map.loadImage('/images/marker_highcap-wells.png', function(error, highcapWellsImg) {
            if (error) throw error;

            map.addImage('allWells', allWellsImg);
            map.addImage('highcapWells', highcapWellsImg);

            visibleLayers.sort((a, b) => (a.drawOrder > b.drawOrder) ? 1 : -1).map((layer) => {
              console.log('adding layer', layer);
              if (
                !map.getSource(`${layer.name}-source`) &&
                layer.spatialData !== null &&
                layer.paint !== null
              ) {
                map.addSource(`${layer.name}-source`, {
                  type: 'geojson',
                  lineMetrics: true,
                  data: layer.spatial_data,
                });

                const newLayer = {
                  id: layer.name,
                  interactive: true,
                  type: layer.geometry_type,
                  source: `${layer.name}-source`,
                  // "source-layer": `${layer.name}-source`,
                  layout: {
                    visibility: layer.visible ? 'visible' : 'none',
                  },
                  paint: layer.paint,
                };

                if (layer.markerType === 'allWells') {
                  newLayer.type = 'symbol';
                  newLayer.layout['icon-image'] = 'allWells';
                  newLayer.layout['icon-size'] = 1;
                  delete newLayer.paint;
                }

                if (layer.markerType === 'highcapWells') {
                  newLayer.type = 'symbol';
                  newLayer.layout['icon-image'] = 'highcapWells';
                  newLayer.layout['icon-size'] = 1;
                  delete newLayer.paint;
                }

                console.log('adding layer ' + layer.name + ' with visible of ' + layer.visible);
                map.addLayer(newLayer);
              }
              return layer;
            });

            map.on('mousemove', function (e) {
              const bbox = [
                [e.point.x - 5, e.point.y - 5],
                [e.point.x + 5, e.point.y + 5]
              ];
              const features = map.queryRenderedFeatures(bbox, {layers: visibleLayers.map(x => x.name)})
              map.getCanvas().style.cursor = features.length ? 'pointer' : '';
            });

            map.fire('zoom');
            console.log('loaded map with ' + visibleLayers.length + ' visible layers');
            //map.setStyle(activeBasemap.styleURL);

            console.log('visibleLayers before setting visibility', visibleLayers);
            visibleLayers.map((layer) => {
              if (
                map.getSource(`${layer.name}-source`) &&
                layer.spatialData !== null &&
                layer.paint !== null
              ) {
                map.getSource(`${layer.name}-source`).setData(layer.spatial_data);
                map.setLayoutProperty(
                  layer.name,
                  'visibility',
                  layer.visible ? 'visible' : 'none',
                );
              }
              return layer;
            });
          });
        },
      );
    }
  }, [map, mapIsLoaded, visibleLayers, mapProvider.visibleLayers, activeBasemap]);

  useEffect(() => {
    if (typeof map !== 'undefined' && map !== null && map.isStyleLoaded()) {
      const layer = filteredLayers.find((d) => d.name === activeZoomToLayer);
      const bbox = turf.bbox(layer.spatial_data);

      map.fitBounds(bbox, {
        padding: 100,
      });
    }
  }, [activeZoomToLayer, map]); //eslint-disable-line

  const getFeatureGeometryObj = (geometryData) => {
    return {
      'type': 'FeatureCollection',
      'features': geometryData.map(feature => ({
        'type': 'Feature',
        'properties': {},
        'geometry': feature.geometry,
      })),
    };
  };

  const clearExistingPopups = () => {
    mapPopups.forEach(x => x.remove());
    setMapPopups([]);
  };

  const getScoreBgColor = (score) => {
    score = parseFloat(score);

    let green = '#28a745';
    let red = '#dc3545';
    let amber = '#ffc107';

    if (score < 4) return green;
    if (score < 7) return amber;
    return red;
  };

  const getScoreColor = (score) => {
    score = parseFloat(score);

    let green = '#ffffff';
    let red = '#ffffff';
    let amber = '#343a40';

    if (score < 4) return green;
    if (score < 7) return amber;
    return red;
  };

  const ResultsPopup = () => {
    if (mapProvider.queryResults && mapProvider.queryResults.data && mapProvider.queryResults.data[0]) {
      return (
        <>
          <Typography variant="subtitle1" align="center">
            {mapProvider.queryResults.data[0].table_label}
          </Typography>
          <Box pb={1} style={{ textAlign: 'center' }}>
            <Typography variant="caption" align="center" gutterBottom>1=LOW, 10=HIGH</Typography>
          </Box>
          <Divider />
          <Flex style={{ alignItems: 'baseline' }}>
            <Box p={2} pb={2} style={{ textAlign: 'center', width: '150px' }}>
              <Typography variant="h6" align="center">
                <Box p={1} mb={1} style={{
                  width: '100%',
                  color: getScoreColor(mapProvider.queryResults.data[0].user_scenario_score),
                  backgroundColor: getScoreBgColor(mapProvider.queryResults.data[0].user_scenario_score),
                  borderRadius: '80px',
                }}>
                  {mapProvider.queryResults.data[0].user_scenario_score}
                </Box>
              </Typography>
              <div>Scenario Score</div>
            </Box>
            <Box p={2} pb={2} style={{ textAlign: 'center', width: '150px' }}>
              <Typography variant="h6" align="center">
                <Box p={1} mb={1} style={{ width: '100%', backgroundColor: '#efefef', borderRadius: '80px' }}>
                  {mapProvider.queryResults.data[0].delta}
                </Box>
              </Typography>
              <div>Change from Background</div>
            </Box>
          </Flex>
          <Divider />
          <Box pt={1} style={{ textAlign: 'center' }}>
            <Typography variant="caption" align="center">Query Area: {mapProvider.queryAreaSize}</Typography>
          </Box>
        </>
      );
    } else {
      return (<div />);
    }
  };

  const processQueryResults = () => {
    clearExistingPopups();
    if (typeof map !== 'undefined' && map !== null && mapProvider.queryResults && geometryData.length > 0) {
      const center = turf.center(getFeatureGeometryObj(geometryData)).geometry.coordinates;

      const area = turf.area(draw.getAll());
      const roundedArea = numbro(parseInt(area / 4046.8564224)).format({ thousandSeparated: true });
      mapProvider.setQueryAreaSize(`${roundedArea} acres`);

      const popup = new mapboxgl.Popup({ closeOnClick: false, maxWidth: '400px' })
        .setLngLat(center)
        .setHTML(ReactDOMServer.renderToStaticMarkup(<ResultsPopup />))
        .addTo(map);

      setMapPopups((prevState) => [...prevState, popup]);
    }

    if (typeof map !== 'undefined' && map !== null) {
      if (geometryData.length === 0) {
        mapProvider.handleControlsVisibility('dataViz', false);
      } else {
        mapProvider.handleControlsVisibility('dataViz', true);
      }
    }
  };

  const handleLayerToggle = (name) => {
    onVisibleLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
    onFilteredLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          // rec.enabled = !rec.enabled;
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
    onLayerChange((prevState) => {
      return [...prevState].map((d, i) => {
        let rec = { ...d };
        if (rec.name === name) {
          // rec.enabled = !rec.enabled;
          rec.visible = !rec.visible;
        }
        return rec;
      });
    });
  };

  return (
    <>
      <div className={classes.toolbar}></div>
      <div ref={mapContainer} className={classes.map}>
        <InitiateDrawingControl
          onInitiateDrawing={handleStartDrawing}
        />
        <BasemapControls
          layers={basemapLayers}
          open={controls.basemap.visible}
          onClose={() => handleControlsVisibility('basemap')}
          activeBasemap={activeBasemap}
          onBasemapChange={onBasemapChange}
        />
        <LayerControl
          layers={visibleLayers.filter((d) => d.enabled)}
          open={controls.layers.visible}
          onLayerChange={handleLayerToggle}
          onZoomToLayerChange={onZoomToLayerChange}
          onClose={() => handleControlsVisibility('layers')}
        />
        <FiltersControls
          open={controls.filterLayers.visible}
          onClose={() => handleControlsVisibility('filterLayers')}
        />
        <DataVizControl
          open={controls.dataViz.visible}
          onClose={() => handleControlsVisibility('dataViz')}
        />
        <PopupControl
          open={controls.popup.visible}
          onClose={() => handleControlsVisibility('popup')}
        />
      </div>
      {controls.popup.visible === false && (
        <div dangerouslySetInnerHTML={{ __html: '<style>.mapboxgl-popup { display: none; }</style>' }}/>
      )}
    </>
  );
};

export default Map;
