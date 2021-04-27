import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Box,
  Typography,
  Grid,
  Button,
  Tooltip,
  Divider,
} from "@material-ui/core";
import BasemapIcon from "@material-ui/icons/Map";

const basemapItemsStyles = (image, theme) => ({
  width: "100%",
  height: 100,
  backgroundSize: "cover",
  backgroundImage: `url(${image})`,
  borderRadius: 4,
});

const useStyles = makeStyles((theme) => ({
  controlOpen: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  controlClosed: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  control: {
    backgroundColor: "#ffffff",
    boxShadow: "0 0 0 2px rgba(0,0,0,.1)",
    borderRadius: 8,
    position: `absolute`,
    zIndex: 1200,
    top: 15,
    right: 15,
    display: "flex",
    flexDirection: "column",
  },
  mapImg: (props) => basemapItemsStyles(props.image, theme),
  activeMapImg: (props) => {
    return {
      ...basemapItemsStyles(props.image, theme),
      border: `3px solid ${theme.palette.secondary.main}`,
    };
  },
  basemapItem: {
    "&:hover": {
      opacity: 0.8,
      cursor: "pointer",
    },
  },
}));

const BasemapItem = ({ active, image, title, onBasemapChange }) => {
  const classes = useStyles({ image });

  return (
    <div className={classes.basemapItem} onClick={onBasemapChange}>
      <div className={active ? classes.activeMapImg : classes.mapImg}></div>
      <Typography variant="body1">{title}</Typography>
    </div>
  );
};

const BasemapControls = ({
  layers = [],
  open = false,
  onClose,
  activeBasemap,
  onBasemapChange,
}) => {
  return (
    <div>
      {open && (
        <Box
          bgcolor="#ffffff"
          boxShadow="0 0 0 2px rgba(0,0,0,.1)"
          borderRadius={4}
          position="absolute"
          zIndex={1200}
          top={15}
          right={75}
          width={300}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#f5f5f6"
            pl={2}
            pr={2}
            pt={1}
            pb={1}
          >
            <Typography variant="h6" gutterBottom>
              Basemap Controls
            </Typography>
            <Button
              variant="contained"
              disableElevation
              color="secondary"
              size="small"
              onClick={onClose}
            >
              Hide
            </Button>
          </Box>
          <Divider />
          <Box p={2}>
            <Grid container spacing={1}>
              {layers.map((layer) => (
                <Grid key={layer.name} item xs={12} md={6}>
                  <BasemapItem
                    active={activeBasemap.name === layer.name}
                    image={layer.image}
                    title={layer.name}
                    onBasemapChange={() => onBasemapChange(layer)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
      <Box
        bgcolor="#ffffff"
        boxShadow="0 0 0 2px rgba(0,0,0,.1)"
        borderRadius={4}
        position="absolute"
        zIndex={1200}
        top={15}
        right={15}
        display="flex"
        flexDirection="column"
      >
        <Tooltip title="Basemap Controls">
          <IconButton color={open ? "secondary" : "default"} onClick={onClose}>
            <BasemapIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default BasemapControls;
