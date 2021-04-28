import React from "react";
import { IconButton, Box, Tooltip } from "@material-ui/core";
import Icon from "@material-ui/icons/Info";

const LegendControl = ({ open = false, onClose }) => {
  return (
    <div>
      <Box
        bgcolor="#ffffff"
        boxShadow="0 0 0 2px rgba(0,0,0,.1)"
        borderRadius={4}
        position="absolute"
        zIndex={1200}
        top={195}
        right={15}
        display="flex"
        flexDirection="column"
      >
        <Tooltip title="Toggle Legend">
          <IconButton color={open ? "secondary" : "default"} onClick={onClose}>
            <Icon />
          </IconButton>
        </Tooltip>
      </Box>
    </div>
  );
};

export default LegendControl;
