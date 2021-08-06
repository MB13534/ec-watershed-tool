import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';

import Accordion from '../../components/Accordion';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const StoriesPanel = props => {
  const classes = useStyles();

  // Configure Stories
  const stories = [
    {
      title: 'Story 1',
    },
    {
      title: 'Story 2',
    },
    {
      title: 'Story 3',
    },
    {
      title: 'Story 4',
    },
    {
      title: 'Story 5',
    },
  ];

  const returnStories = item => {
    return (
      <Box m={1} key={item.title}>
        <Button
          variant="contained"
          disableElevation
          size="medium"
          color="secondary"
          fullWidth
          // onClick={() => handleStory()}
        >
          {item.title}
        </Button>
      </Box>
    );
  };

  // Configure external links
  const externalLinks = [
    {
      link: 'www.google.com',
      title: 'Google',
    },
    {
      link: 'www.yahoo.com',
      title: 'Yahoo',
    },
    {
      link: 'www.bing.com',
      title: 'Bing',
    },
    {
      link: 'www.wikipedia.com',
      title: 'Wikipedia',
    },
    {
      link: 'www.twitter.com',
      title: 'Twitter',
    },
    {
      link: 'www.lrewater.com',
      title: 'LRE',
    },
    {
      link: 'www.mbarry.net',
      title: 'MBARRY',
    },
  ];

  const returnExternalLinks = item => {
    return (
      <Box m={1} key={item.title}>
        <Button
          target="_blank"
          variant="contained"
          disableElevation
          size="medium"
          color="secondary"
          fullWidth
          href={`https://${item.link}`}
        >
          {item.title}
        </Button>
      </Box>
    );
  };

  return (
    <div className={classes.root}>
      <Box p={2} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <Accordion title="Stories" content={<>{stories.map(item => returnStories(item))}</>} />
      </Box>
      <Box p={2} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <Accordion title="Links and Resources" content={<>{externalLinks.map(item => returnExternalLinks(item))}</>} />
      </Box>
    </div>
  );
};

export default StoriesPanel;
