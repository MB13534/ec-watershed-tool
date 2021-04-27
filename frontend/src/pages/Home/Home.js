import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
} from "@material-ui/core";

import logo from "../../images/starterkit_logo_black.png";
import Layout from "../../components/Layout";

// create page styles
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  logo: {
    width: 250,
    marginLeft: "auto",
    marginRight: "auto",
    "& img": {
      maxWidth: "100%",
    },
  },
  description: {
    marginTop: 0,
    marginBottom: theme.spacing(2),
    lineHeight: 1.8,
    fontSize: 18,
    textAlign: "left",
  },
}));

const Home = (props) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <div className={classes.logo}>
          <img src={logo} alt="Starterkit Logo" />
        </div>
        <Typography variant="h4" style={{ textAlign: "left" }} gutterBottom>
          Eagle County Watershed Tool Overview
        </Typography>
        <Typography variant="body1" className={classes.description}>
          This starter kit represents a common structure for a fullstack
          JavaScript web application and consists of backend API (server side)
          and frontend single page application (client side). The backend API
          that handles all of the data while the frontend is the actual
          application that the user interacts with in their web browser. Both
          the backend and frontend use the Identity-as-a-Service provider{" "}
          <a href="https://auth0.com/">Auth0</a> to handle
          authentication/authorization.
        </Typography>
        <Typography variant="body1" className={classes.description}>
          This Starterkit can be used for most of LRE's data management needs
          and can be easily customized to accommodate just about every use case.
          This Starterkit doesn't even have to be used for data management. It
          is a good candidate as the starting point for any project that needs a
          robust authentication system and the ability to communicate with a
          database.
        </Typography>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Authentication
                </Typography>
                <Typography variant="body1">
                  Authentication and User Roles are setup nearly right out of
                  the box.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Fully Developed API
                </Typography>
                <Typography variant="body1">
                  A fully developed API makes it easy to communicate with the
                  database.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  Documentation
                </Typography>
                <Typography variant="body1">
                  The Starterkit is fully documented making it easy to get up
                  and running.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;
