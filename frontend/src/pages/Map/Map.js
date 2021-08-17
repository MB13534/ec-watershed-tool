import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper } from '@material-ui/core';

import MapLayout from '../../components/MapLayout';
import MapDrawer from '../../components/MapDrawer';
import Map from '../../components/Map';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useMap } from './MapProvider';
import clsx from 'clsx';
import Alert from '@material-ui/lab/Alert';
import AnalyticsPopupDetails from '../../components/Map/AnalyticsPopupDetails';
import Legend from '../../components/Legend';
import FormSnackbar from '../../components/FormSnackbar';

// create page styles
const useStyles = makeStyles(theme => ({
  root: {
    overflowX: `hidden`,
    [theme.breakpoints.up('md')]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: theme.mixins.toolbar,
  },
  content2: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: '64px',
  },
  boxFull: {
    width: 'calc(100% - 60px)',
  },
  boxCollapsed: {
    width: 'calc(100% - 60px)',
  },
  boxOpen: {
    height: 'auto',
    maxHeight: '500px',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  boxClose: {
    maxHeight: 0,
    overflow: 'hidden',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  unsentFull: {
    width: 'calc(100% - 120px - 20px)',
    marginTop: 'calc(64px + 10px)',
    '& .MuiPaper-root': {},
  },
  unsentCollapsed: {
    width: 'calc(100% - 50px - 120px)',
  },
  unsentOpen: {
    height: 'auto',
    maxHeight: '500px',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  unsentClose: {
    maxHeight: 0,
    overflow: 'hidden',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  tooBigErrorFull: {
    width: 'calc(100% - 120px - 20px)',
    marginTop: 'calc(64px + 10px)',
    '& .MuiPaper-root': {},
  },
  tooBigErrorCollapsed: {
    width: 'calc(100% - 50px - 120px)',
  },
  tooBigErrorOpen: {
    height: 'auto',
    maxHeight: '500px',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  tooBigErrorClose: {
    maxHeight: 0,
    overflow: 'hidden',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const MapPage = () => {
  const classes = useStyles();
  const map = useMap();

  const [showQueryTooBigError, setShowQueryTooBigError] = useState(false);
  const [lastQuerySize, setLastQuerySize] = useState(null);

  const monitoringLegendColors = [
    { name: `0 - Constituent not detected`, color: `#228044` },
    { name: `1 - Below benchmark`, color: `#16f465` },
    { name: `2 - Approaching benchmark`, color: `#FFEB3B` },
    { name: `3 - Above benchmark`, color: `#F9A825` },
    { name: `4 - Above secondary benchmark`, color: `#c61717` },
  ];

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    return () => {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    };
  }, []);

  return (
    <MapLayout>
      <div className={classes.root}>
        <MapDrawer />
        <div className={map.mapMode === 'explore' || map.mapMode === 'analyze' ? classes.content2 : classes.content}>
          <Box
            className={clsx(showQueryTooBigError ? classes.tooBigErrorFull : classes.tooBigErrorCollapsed, {
              [classes.tooBigErrorOpen]: showQueryTooBigError,
              [classes.tooBigErrorClose]: !showQueryTooBigError,
            })}
            ml="60px"
            top="60px"
            zIndex={1400}
            position="absolute"
          >
            <Alert severity="error">
              <strong>Please Reduce Query Area</strong> &mdash; Selected area is currently {lastQuerySize} out of a max
              of 1,200,000 acres.
            </Alert>
          </Box>

          <Legend legendColors={monitoringLegendColors} />
          <Box bgcolor="#f1f1f1" width="100%">
            <Map setShowQueryTooBigError={setShowQueryTooBigError} setLastQuerySize={setLastQuerySize} />
          </Box>

          <Box
            className={clsx(map.controls.drawer.visible ? classes.boxFull : classes.boxCollapsed, {
              [classes.boxOpen]: map.controls.dataViz.visible,
              [classes.boxClose]: !map.controls.dataViz.visible,
            })}
            ml="30px"
            bottom={map.mapMode === 'explore' || map.mapMode === 'analyze' ? '94px' : '30px'}
            zIndex={1200}
            position="absolute"
          >
            <Paper style={{ padding: 24, paddingTop: 8 }}>
              {(map.analyticsResults || map.geometryData) && (
                <>
                  <AnalyticsPopupDetails map={map} />
                </>
              )}
            </Paper>
          </Box>
        </div>
      </div>
      <FormSnackbar
        open={map.snackbarOpen}
        error={map.snackbarError}
        handleClose={map.handleSnackbarClose}
        successMessage={map.snackbarSuccessMessage}
        errorMessage={map.snackbarErrorMessage}
      />
    </MapLayout>
  );
};

export default MapPage;
