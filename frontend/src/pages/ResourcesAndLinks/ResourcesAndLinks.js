import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container } from '@material-ui/core';
import Layout from '../../components/Layout';

// create page styles
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(8),
  },
  description: {
    marginTop: 0,
    marginBottom: theme.spacing(2),
    lineHeight: 1.8,
    fontSize: 18,
    textAlign: 'left',
  },
}));

const ResourcesAndLinks = props => {
  const classes = useStyles();

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Resources & Links
        </Typography>
        <Typography variant="body1" className={classes.description} paragraph>
          This will be a list of external links and resources
        </Typography>
      </Container>
    </Layout>
  );
};

export default ResourcesAndLinks;
