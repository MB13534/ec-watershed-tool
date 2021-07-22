import React from "react";
import { Box, Button, Tooltip } from '@material-ui/core';
import ButtonIcon from "@material-ui/icons/Add";
import { useMap } from '../../pages/Map/MapProvider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
const InitiateDrawingControl = ({ onInitiateDrawing }) => {
  const map = useMap();
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
        {map.queryAreaSize && (
          <Paper elevation={0} style={{
            position: 'absolute',
            left: '100%',
            width: 'auto',
            whiteSpace: 'nowrap',
            padding: '8px',
            marginLeft: '-1px',
            marginTop: '-2px',
            backgroundColor: 'lightyellow',
            border: '2px solid rgba(0,0,0,.18)',
            borderLeftWidth: '0',
          }}>
            <Typography variant={'caption'}>&nbsp; {map.queryAreaSize}</Typography>
          </Paper>
        )}
        <Tooltip title="Click or Drag on Map to Define Query Area">
          <Button startIcon={<ButtonIcon/>} color="default" onClick={onInitiateDrawing} style={{paddingLeft: '15px'}}>
            Define Query Area &nbsp;
          </Button>
        </Tooltip>
      </Box>
    </div>
  );
};

export default InitiateDrawingControl;
