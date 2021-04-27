import React, { useContext } from "react";
import { Box, Typography, Button, Divider } from "@material-ui/core";
import ChipsFilter from "../ChipsFilter/ChipsFilter";
import { MapContext } from "../../pages/Map/MapProvider";

const FiltersControls = ({ open = false, onClose, onLayerChange }) => {
  const { filterValues, onFilterValuesChange } = useContext(MapContext);

  const LayerCategories = [
    { cat_ndx: 1, cat_desc: "Basemap" },
    { cat_ndx: 2, cat_desc: "Water" },
    { cat_ndx: 3, cat_desc: "Land" },
    { cat_ndx: 4, cat_desc: "Monitoring Points" },
  ];

  const GeometryTypes = [
    { ndx: 1, desc: "Line" },
    { ndx: 2, desc: "Point" },
    { ndx: 3, desc: "Polygon" },
    { ndx: 4, desc: "Gradient" },
  ];

  return (
    <div>
      {open && (
        <Box
          bgcolor="#ffffff"
          boxShadow="0 0 0 2px rgba(0,0,0,.1)"
          borderRadius={4}
          position="absolute"
          zIndex={1200}
          top={10}
          left={50}
          // p={2}
          width={500}
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
            <Typography variant="h6">Filter Layers</Typography>
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
          <Box mt={1} mb={1} ml={2} mr={2}>
            <ChipsFilter
              title="Layer Categories"
              name="layerCategories"
              data={LayerCategories}
              values={filterValues.layerCategories}
              onChange={onFilterValuesChange}
              valueField="cat_ndx"
              displayField="cat_desc"
            />
          </Box>
          <Divider />
          <Box mt={1} mb={1} ml={2} mr={2}>
            <ChipsFilter
              title="Geometry Types"
              name="geometryTypes"
              data={GeometryTypes}
              values={filterValues.geometryTypes}
              onChange={onFilterValuesChange}
              valueField="ndx"
              displayField="desc"
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default FiltersControls;
