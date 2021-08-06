import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Drawer, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HideIcon from '@material-ui/icons/VisibilityOff';
import StoriesPanel from './StoriesPanel';

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 0,
  },
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
  btn: {
    margin: theme.spacing(2),
  },
}));

const StoriesDrawer = ({ drawerVisible, setDrawerVisible }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerVisible,
        [classes.drawerClose]: !drawerVisible,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: drawerVisible,
          [classes.drawerClose]: !drawerVisible,
        }),
      }}
    >
      <div className={classes.toolbar} />
      <div className={classes.toolbar2} />
      {drawerVisible && <StoriesPanel />}

      {drawerVisible ? (
        <>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => setDrawerVisible(false)}
            className={classes.btn}
            startIcon={<HideIcon />}
          >
            Hide Navigation
          </Button>
          {/* Necessary to create padding below btn */}
          <div className={classes.toolbar} />
        </>
      ) : (
        <IconButton onClick={() => setDrawerVisible(true)}>
          <MenuIcon />
        </IconButton>
      )}
    </Drawer>
  );
};

export default StoriesDrawer;
