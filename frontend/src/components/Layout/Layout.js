import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "../Sidebar";

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: `hidden`,
    [theme.breakpoints.up("md")]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Sidebar />
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default Layout;
