import React from 'react';
import { Container, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../../components/Layout';

import DataStudioEmbed from '../../../components/DataStudioEmbed/DataStudioEmbed';

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

const Benchmarks = props => {
  const classes = useStyles();

  return (
    <Layout>
      <Box marginTop={6} marginBottom={3} width="100%">
        <Container maxWidth="xl">
          <DataStudioEmbed
            title="Water Quality Benchmarks & Rationale"
            src="https://docs.google.com/spreadsheets/d/1dgbxyrcfqlL6E0Ewd0tP5wCNML7NbMiOmZ1_gNxRNBM/edit#gid=0"
            width="95%"
            height={750}
            frameBorder={0}
          />
        </Container>
      </Box>
    </Layout>
  );
};

export default Benchmarks;
