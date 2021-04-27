import React from "react";
import { Typography, Box } from "@material-ui/core";

const DrawerTabPanel = ({ children, activeTab, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={activeTab !== index}
      id={`sidebar-tab-panel-${index}`}
      aria-labelledby={`sidebar-tab-${index}`}
      {...other}
    >
      {activeTab === index && <Box p={0}>{children}</Box>}
    </Typography>
  );
};

export default DrawerTabPanel;
