import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import Sidebar from "../Sidebar";
import TopNav from "../TopNav";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: `hidden`,
    // [theme.breakpoints.up("md")]: {
    //   display: `flex`,
    // },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
}));

const MapLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <div className={classes.root}>
      {desktop ? <TopNav /> : <Sidebar />}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default MapLayout;
