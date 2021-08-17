import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StoriesMap from '../../../components/StoriesMap';
import StoriesLayout from '../../../components/StoriesLayout';
import StoriesDrawer from '../../../components/StoriesDrawer';
import { Box } from '@material-ui/core';
import Legend from '../../../components/Legend';
import StoriesAnalyticsPopupDetails from '../../../components/StoriesMap/StoriesAnalyticsPopupDetails';
import clsx from 'clsx';

// create page styles
const useStyles = makeStyles(theme => ({
  root: {
    overflowX: `hidden`,
    [theme.breakpoints.up('md')]: {
      display: `flex`,
    },
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    marginTop: '128px',
  },
}));

const Stories2 = () => {
  const classes = useStyles();

  return (
    <StoriesLayout>
      <div className={classes.root}>
        <div className={classes.content}>This is the content of the next stories page</div>
      </div>
    </StoriesLayout>
  );
};

export default Stories2;
