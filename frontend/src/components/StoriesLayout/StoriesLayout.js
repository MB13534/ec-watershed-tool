import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import Sidebar from '../Sidebar';
import TopNavStories from '../TopNavStories';

const useStyles = makeStyles(theme => ({
  root: {
    overflow: `hidden`,
    // [theme.breakpoints.up("md")]: {
    //   display: `flex`,
    // },
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
  },
}));

const StoriesLayout = ({ children, waterYear, startMonth, endMonth, setWaterYear, setStartMonth, setEndMonth }) => {
  const classes = useStyles();

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <div className={classes.root}>
      {desktop ? (
        <TopNavStories
          waterYear={waterYear}
          startMonth={startMonth}
          endMonth={endMonth}
          setWaterYear={setWaterYear}
          setStartMonth={setStartMonth}
          setEndMonth={setEndMonth}
        />
      ) : (
        <Sidebar />
      )}
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export default StoriesLayout;
