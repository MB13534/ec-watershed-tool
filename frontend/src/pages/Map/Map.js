import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper } from '@material-ui/core';

import MapLayout from '../../components/MapLayout';
import MapDrawer from '../../components/MapDrawer';
import Map from '../../components/Map';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { useMap } from './MapProvider';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useAuth0 } from '../../hooks/useAuth0';
import { HourglassEmpty } from '@material-ui/icons';
import ResultsPopupDetails from '../../components/Map/ResultsPopupDetails';

// create page styles
const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: `hidden`,
    [theme.breakpoints.up('md')]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    marginTop: theme.mixins.toolbar,
  },
  boxFull: {
    width: 'calc(100% - 340px - 60px)',
  },
  boxCollapsed: {
    width: 'calc(100% - 50px - 60px)',
  },
  boxOpen: {
    height: 'auto',
    maxHeight: '400px',
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
    width: 'calc(100% - 340px - 120px - 20px)',
    marginTop: 'calc(64px + 10px)',
    '& .MuiPaper-root': {},
  },
  unsentCollapsed: {
    width: 'calc(100% - 50px - 120px)',
  },
  unsentOpen: {
    height: 'auto',
    maxHeight: '400px',
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
    width: 'calc(100% - 340px - 120px - 20px)',
    marginTop: 'calc(64px + 10px)',
    '& .MuiPaper-root': {},
  },
  tooBigErrorCollapsed: {
    width: 'calc(100% - 50px - 120px)',
  },
  tooBigErrorOpen: {
    height: 'auto',
    maxHeight: '400px',
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
  const { getTokenSilently } = useAuth0();

  const [hasChanges, setHasChanges] = useState(false);
  const [showQueryTooBigError, setShowQueryTooBigError] = useState(false);
  const [lastQuerySize, setLastQuerySize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [handleRefresh, setHandleRefresh] = useState(false);

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    return () => {
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    };
  }, []);

  const handleUpdateClick = async () => {
    setLoading(true);

    const token = await getTokenSilently();
    const headers = { Authorization: `Bearer ${token}` };
    await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/functions/process-control-selections`, { headers});

    setHandleRefresh(!handleRefresh);

    setHasChanges(false);
    setLoading(false);
  };

  return (
    <MapLayout>
      <div className={classes.root}>
        <MapDrawer setHasChanges={setHasChanges} handleRefresh={handleRefresh}/>
        <div className={classes.content}>
          <Box
            className={clsx(loading ? classes.loading : '', hasChanges ? classes.unsentFull : classes.unsentCollapsed, {
              [classes.unsentOpen]: hasChanges,
              [classes.unsentClose]: !hasChanges,
            })}
            ml="60px"
            top="60px"
            zIndex={1399}
            position="absolute"
          >
            <Alert severity="info"
                   action={
                     <>
                       {loading && (
                         <Button disabled color="inherit" size="small" startIcon={
                           <HourglassEmpty style={{
                             animation: 'rotation 2s infinite linear',
                           }}/>
                         }>
                           Loading, Please Wait...
                         </Button>
                       )}
                       {!loading && (
                         <Button color="inherit" size="small" onClick={handleUpdateClick}>
                           UPDATE
                         </Button>
                       )}
                     </>
                   }>
              <strong>Query Changes Detected</strong> &mdash; Do you want to update the query?
            </Alert>
          </Box>

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
              <strong>Please Reduce Query Area</strong> &mdash; Selected area is currently {lastQuerySize} out of a max of 2,800 acres.
            </Alert>
          </Box>

          <Box bgcolor="#f1f1f1" width="100%">
            <Map setHasChanges={setHasChanges} setShowQueryTooBigError={setShowQueryTooBigError} setLastQuerySize={setLastQuerySize} handleRefresh={handleRefresh}/>
          </Box>

          <Box
            className={clsx(map.controls.drawer.visible ? classes.boxFull : classes.boxCollapsed, {
              [classes.boxOpen]: map.controls.dataViz.visible,
              [classes.boxClose]: !map.controls.dataViz.visible,
            })}
            ml="30px"
            bottom="30px"
            zIndex={1399}
            position="absolute"
          >
            <Paper style={{ padding: 24, paddingTop: 8 }}>
              {(!map.geometryData || map.geometryData.length === 0) &&
              <Box pt={2}><Typography variant="body1" align="center">Please use the drawing tools to define an area to query.</Typography></Box>
              }
              {(map.queryResults && map.geometryData && map.geometryData.length > 0) &&
              <>
                <ResultsPopupDetails map={map} />
              </>
              }
            </Paper>
          </Box>
        </div>
      </div>
    </MapLayout>
  );
};

export default MapPage;
