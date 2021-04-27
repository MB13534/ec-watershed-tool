import React, { Component } from "react";
import * as Sentry from "@sentry/browser";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: `center`,
    alignItems: `flex-start`,
    backgroundColor: `#fafafa`,
    minHeight: `100vh`,
  },
  errorBlock: {
    width: `90%`,
    [theme.breakpoints.up("md")]: {
      width: `25%`,
    },
    [theme.breakpoints.down("md")]: {
      width: `45%`,
    },
    [theme.breakpoints.down("xs")]: {
      width: `90%`,
    },
    marginTop: 60,
    padding: 20,
    textAlign: `center`,
  },
  bugBtn: {
    backgroundColor: `#F44336`,
    color: `#ffffff`,
    margin: `15px 5px 15px 5px`,
    display: "inline-block",
  },
  homeBtn: {
    margin: `15px 5px 15px 5px`,
    display: "inline-block",
  },
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, eventId: null };
    this.reportBug = this.reportBug.bind(this);
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  reportBug() {
    Sentry.showReportDialog({ eventId: this.state.eventId });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <div className={this.props.classes.root}>
          <Paper className={this.props.classes.errorBlock}>
            <Typography variant="h3" style={{ marginBottom: 25 }}>
              Oops!
            </Typography>
            <Typography variant="body1">
              It looks like you have encountered an error. The issue has been
              reported to LRE staff. If you would like to file an additional
              report you can use the button below. Otherwise you can return to
              home page using the button below.
            </Typography>
            <Button
              variant="contained"
              className={this.props.classes.bugBtn}
              onClick={this.reportBug}
            >
              Report feedback
            </Button>
            <Button
              variant="contained"
              className={this.props.classes.homeBtn}
              onClick={() => (window.location.href = "/")}
            >
              Return Home
            </Button>
          </Paper>
        </div>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default withStyles(styles, { withTheme: true })(ErrorBoundary);
