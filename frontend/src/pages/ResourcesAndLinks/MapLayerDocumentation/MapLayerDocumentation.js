import React from 'react';
import { Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../../components/Layout';

import DataStudioEmbed from '../../../components/DataStudioEmbed/DataStudioEmbed';

// create page styles
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    position: 'absolute',
    top: '0px',
    left: '270px',
    right: 0,
    bottom: '0',
    width: 'calc(100% - 280px)',
  },
  // description: {
  //   marginTop: 0,
  //   marginBottom: theme.spacing(2),
  //   lineHeight: 1.8,
  //   fontSize: 18,
  //   textAlign: 'left',
  // },
}));

const MapLayerDocumentation = props => {
  const classes = useStyles();

  return (
    <Layout>
      <Box marginTop={3} marginBottom={3}>
        <Container className={classes.container}>
          <DataStudioEmbed
            title="Water Quality Benchmarks & Rationale"
            src="https://docs.google.com/spreadsheets/d/1J9rgMGp1k8GnGKmTKl01qSBmSEgxoySyu_eZGdeJnXs/edit#gid=684584554"
            width="100%"
            height="100%"
            frameBorder={0}
          />
        </Container>
      </Box>
    </Layout>
  );
};

export default MapLayerDocumentation;
