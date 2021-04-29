import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Tabs, Tab } from "@material-ui/core";
import LayersIcon from "@material-ui/icons/Layers";
import ControlsIcon from "@material-ui/icons/Tune";

const useStyles = makeStyles((theme) => ({
  tabs: {
    marginTop: theme.spacing(1),
    borderBottom: "1px solid #dddddd",
  },
  tab: {
    display: "flex",
    justifyItems: "center",
  },
}));

function a11yProps(index) {
  return {
    id: `sidebar-tab-${index}`,
    "aria-controls": `sidebar-tabs-panel-${index}`,
  };
}

const DrawerTabs = ({ activeTab, setActiveTab }) => {
  const classes = useStyles();

  /**
   * Utility function used to set the tab label
   * Adds in the provided icon as well
   * @param {*} label
   * @param {*} Icon
   */
  const setTabLabel = (label, Icon) => {
    return (
      <div className={classes.tab}>
        <Icon style={{ marginRight: 8 }} />
        {label}
      </div>
    );
  };

  /**
   * Event handler for setting the active tab
   * Additionally updates the "er_active_report_tab"
   * in the user's session storage so that their
   * last selected tab is remembered
   * @param {*} event
   * @param {*} newValue
   */
  const handleChange = (event, newValue) => {
    sessionStorage.setItem("sk_active_drawer_tab", parseInt(newValue));
    setActiveTab(newValue);
  };

  return (
    <Tabs
      className={classes.tabs}
      value={activeTab}
      indicatorColor="primary"
      textColor="primary"
      onChange={handleChange}
      aria-label="sidebar-tabs-nav"
    >
      <Tab label={setTabLabel("Layers", LayersIcon)} {...a11yProps(0)} />
      <Tab label={setTabLabel("Water Quality", ControlsIcon)} {...a11yProps(1)} />
    </Tabs>
  );
};

export default DrawerTabs;
