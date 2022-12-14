import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HideIcon from '@material-ui/icons/VisibilityOff';
import DrawerTabPanel from '../DrawerTabPanel/DrawerTabPanel';
import { MapContext, useMap } from '../../pages/Map/MapProvider';
import LayersPanel from './LayersPanel';
import ControlsPanel from './ControlsPanel';
import { Help } from '@material-ui/icons';

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 0,
  },
  drawerContainer: {},
  drawerOpen: {
    backgroundColor: '#f7f7f7',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: '#f7f7f7',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6) + 1,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  toolbar2: theme.mixins.toolbar,
  lreLogo: {
    display: 'block',
    width: '100%',
    textAlign: 'center',
    bottom: 20,
    '& img': {
      maxWidth: 120,
    },
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  selected: {
    borderRight: `2px solid ${theme.palette.primary.main}`,
  },
  settingsIcon: {
    color: theme.palette.text.secondary,
  },
  popover: {
    padding: theme.spacing(2),
    maxWidth: 400,
  },
  btn: {
    margin: theme.spacing(2),
  },
}));

const MapDrawer = () => {
  const classes = useStyles();
  const mapProvider = useMap();

  const { controls, handleControlsVisibility } = useContext(MapContext);

  const [activeTab, setActiveTab] = useState(parseInt(sessionStorage.getItem('sk_active_drawer_tab')) || 0);

  useEffect(() => {
    if (mapProvider.mapMode === 'explore') {
      setActiveTab(0);
    }
    if (mapProvider.mapMode === 'analyze') {
      setActiveTab(1);
    }
  }, [mapProvider.mapMode]);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: controls.drawer.visible,
        [classes.drawerClose]: !controls.drawer.visible,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: controls.drawer.visible,
          [classes.drawerClose]: !controls.drawer.visible,
        }),
      }}
    >
      <div className={classes.toolbar} />
      {(mapProvider.mapMode === 'analyze' || mapProvider.mapMode === 'explore') && <div className={classes.toolbar2} />}
      {controls.drawer.visible && (
        <div className={classes.drawerContainer}>
          {/*<DrawerTabs activeTab={activeTab} setActiveTab={setActiveTab} />*/}
          <DrawerTabPanel activeTab={activeTab} index={0}>
            <LayersPanel />
          </DrawerTabPanel>
          <DrawerTabPanel activeTab={activeTab} index={1}>
            <ControlsPanel />
          </DrawerTabPanel>
        </div>
      )}

      {controls.drawer.visible ? (
        <>
          <Button
            href="resources-links/map-layer-documentation"
            color="primary"
            startIcon={<Help />}
            style={{ marginTop: '10px' }}
          >
            Map Layer Documentation
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleControlsVisibility('drawer', false)}
            className={classes.btn}
            startIcon={<HideIcon />}
          >
            Hide Navigation
          </Button>
          {/* Necessary to create padding below btn */}
          <div className={classes.toolbar} />
        </>
      ) : (
        <IconButton onClick={() => handleControlsVisibility('drawer', true)}>
          <MenuIcon />
        </IconButton>
      )}
    </Drawer>
  );
};

export default MapDrawer;
