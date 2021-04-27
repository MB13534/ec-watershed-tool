import React from "react";
import { Box, Button, Tooltip } from '@material-ui/core';
import ButtonIcon from "@material-ui/icons/Add";

const InitiateDrawingControl = ({ onInitiateDrawing }) => {
  return (
    <div>
      <Box
        bgcolor="#ffffff"
        boxShadow="0 0 0 2px rgba(0,0,0,.1)"
        borderRadius={4}
        position="absolute"
        zIndex={1200}
        top={15}
        left="calc(50% - 100px)"
        display="flex"
        flexDirection="column"
      >
        <Tooltip title="Click or Drag on Map to Define Query Area">
          <Button startIcon={<ButtonIcon/>} color="default" onClick={onInitiateDrawing} style={{paddingLeft: '15px'}}>
            Define Query Area
          </Button>
        </Tooltip>
      </Box>
    </div>
  );
};

export default InitiateDrawingControl;
