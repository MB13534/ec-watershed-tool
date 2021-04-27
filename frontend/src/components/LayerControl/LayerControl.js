import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  Box,
  Typography,
  Button,
  Tooltip,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Checkbox,
  Divider,
} from "@material-ui/core";
import ZoomIcon from "@material-ui/icons/ZoomIn";
import LayersIcon from "@material-ui/icons/Layers";
import LineIcon from "../../images/line_icon.png";
import PolygonIcon from "../../images/polygon_icon.png";
import PointIcon from "../../images/point_icon.png";

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
    // display: "flex",
    // flexDirection: "column",
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
  img: {
    width: "100%",
  },
}));

const setIcon = (type) => {
  const geometryFormatted = type.toLowerCase();
  if (geometryFormatted === "line") return LineIcon;
  if (geometryFormatted === "fill") return PolygonIcon;
  if (geometryFormatted === "circle") return PointIcon;
};

const LayerItem = ({
  active,
  name,
  geometryType,
  onLayerChange,
  onZoomToLayerChange,
}) => {
  const classes = useStyles();

  return (
    <ListItem button>
      <Box width={20} mr={2}>
        <img
          src={setIcon(geometryType)}
          alt={geometryType}
          className={classes.img}
        />
      </Box>
      <ListItemText primary={name} className={classes.listItemText} />
      <ListItemSecondaryAction className={classes.secondaryAction}>
        {active && (
          <IconButton onClick={() => onZoomToLayerChange(name)}>
            <ZoomIcon className={classes.zoomIcon} />
          </IconButton>
        )}
        <Checkbox
          edge="start"
          checked={active}
          tabIndex={-1}
          disableRipple
          inputProps={{ "aria-labelledby": "Layer Toggle" }}
          color="primary"
          onChange={() => onLayerChange(name)}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const LayerControl = ({
  layers = [],
  open = false,
  onClose,
  onLayerChange,
  onZoomToLayerChange,
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
          // p={2}
          width={350}
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
              Layer Controls
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
          <List dense>
            {layers.length === 0 && (
              <Typography variant="body1" align="center">
                No layers selected
              </Typography>
            )}
            {layers.map((layer) => (
              <LayerItem
                active={layer.visible}
                name={layer.name}
                geometryType={layer.geometry_type}
                onLayerChange={onLayerChange}
                onZoomToLayerChange={onZoomToLayerChange}
              />
            ))}
          </List>
        </Box>
      )}
      <Box
        bgcolor="#ffffff"
        boxShadow="0 0 0 2px rgba(0,0,0,.1)"
        borderRadius={4}
        position="absolute"
        zIndex={1200}
        top={75}
        right={15}
        display="flex"
        flexDirection="column"
      >
        <Tooltip title="Layers Controls">
          <IconButton color={open ? "secondary" : "default"} onClick={onClose}>
            <LayersIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default LayerControl;
