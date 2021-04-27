import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";
import Layout from "../../components/Layout";

// create page styles
const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
  },
  description: {
    marginTop: 0,
    marginBottom: theme.spacing(2),
    lineHeight: 1.8,
    fontSize: 18,
    textAlign: "left",
  },
}));

const AuthenticatedHome = (props) => {
  const classes = useStyles();

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Authenticated Home Page Example
        </Typography>
        <Typography variant="body1" className={classes.description} paragraph>
          You could put super secret content here that users can only see if
          they are logged in.
        </Typography>
      </Container>
    </Layout>
  );
};

export default AuthenticatedHome;
