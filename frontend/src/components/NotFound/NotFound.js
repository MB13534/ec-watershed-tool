import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Button } from "@material-ui/core";

const link = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
}));

const NotFound = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h2" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Button variant="contained" component={link} color="primary" to="/">
        Return Home
      </Button>
    </div>
  );
};

export default NotFound;
