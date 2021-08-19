import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StoriesMap from '../../../components/StoriesMap';
import StoriesLayout from '../../../components/StoriesLayout';
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
    marginTop: '64px',
  },
  box: {
    width: 'calc(100% - 120px - 20px)',
  },
  boxOpen: {
    height: 'auto',
    maxHeight: '408px',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  boxClose: {
    maxHeight: 0,
    overflow: 'hidden',
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const StreamflowExplorePage = () => {
  const classes = useStyles();

  //track visibility of data popup info to change css styles
  const [dataVizVisible, setDataVizVisible] = useState(true);

  //used to take user date inputs
  const currentMonth = new Date().getMonth();
  const [waterYear, setWaterYear] = useState({ wateryear: 2021 });
  //a water year is oct to sep, so oct is default, watermonth is for value/query, month_abbrev is for display
  const [startMonth, setStartMonth] = useState({ watermonth: 7, month_abbrev: 'Apr' });
  //transfer new Date month to water year
  const months = {
    0: 4,
    1: 5,
    2: 6,
    3: 7,
    4: 8,
    5: 9,
    6: 10,
    7: 11,
    8: 12,
    9: 1,
    10: 2,
    11: 3,
  };
  //water year value to display prop
  const waterMonths = {
    1: 'Oct',
    2: 'Nov',
    3: 'Dec',
    4: 'Jan',
    5: 'Feb',
    6: 'Mar',
    7: 'Apr',
    8: 'May',
    9: 'Jun',
    10: 'Jul',
    11: 'Aug',
    12: 'Sep',
  };
  //current month is default, watermonth is for value/query, month_abbrev is for display
  const [endMonth, setEndMonth] = useState({
    watermonth: months[currentMonth],
    month_abbrev: waterMonths[months[currentMonth]],
  });

  //gradient results to render points on map - gradient used to color points
  const [gradientData, setGradientData] = useState(null);
  //hydrograph results
  const [hydrographData, setHydrographData] = useState(null);
  //tableStats results
  const [tableStatsData, setTableStatsData] = useState(null);
  //tableStats results
  const [tableStatsInfo, setTableStatsInfo] = useState(null);
  //tracks async data fetching for loading screen
  const [isDataLoading, setIsDataLoading] = useState(false);
  //sets index for last point clicked - used for properties table
  const [lastLocationNdx, setLastLocationNdx] = useState(null);
  //if no data is returned this allows conditionals in the analytics popup
  const [isHydrographDataNull, setIsHydrographDataNull] = useState('');
  const [isTableStatsDataNull, setIsTableStatsDataNull] = useState('');

  //legend display
  const monitoringLegendColors = [
    { name: `Much Wetter than Normal (> 140%)`, color: `#000087` },
    { name: `Wetter than Normal (120-140%)`, color: `#A8D1DF` },
    { name: `Normal (80-120%)`, color: `#008140` },
    { name: `Drier than Normal (60-80%)`, color: `#F76300` },
    { name: `Much Drier than Normal (< 60%)`, color: `#E20000` },
    { name: `No data`, color: `#fff` },
  ];

  return (
    <StoriesLayout
      waterYear={waterYear}
      startMonth={startMonth}
      endMonth={endMonth}
      setWaterYear={setWaterYear}
      setStartMonth={setStartMonth}
      setEndMonth={setEndMonth}
    >
      <div className={classes.root}>
        <div className={classes.content}>
          <Legend legendColors={monitoringLegendColors} />
          <Box bgcolor="#f1f1f1" width="100%">
            <StoriesMap
              lastLocationNdx={lastLocationNdx}
              setLastLocationNdx={setLastLocationNdx}
              waterYear={waterYear}
              startMonth={startMonth}
              endMonth={endMonth}
              setGradientData={setGradientData}
              gradientData={gradientData}
              setHydrographData={setHydrographData}
              setTableStatsData={setTableStatsData}
              setTableStatsInfo={setTableStatsInfo}
              setDataVizVisible={setDataVizVisible}
              dataVizVisible={dataVizVisible}
              setIsDataLoading={setIsDataLoading}
              setIsTableStatsDataNull={setIsTableStatsDataNull}
              setIsHydrographDataNull={setIsHydrographDataNull}
            />
          </Box>

          <Box
            className={clsx(classes.box, {
              [classes.boxOpen]: dataVizVisible,
              [classes.boxClose]: !dataVizVisible,
            })}
            ml="60px"
            bottom="30px"
            zIndex={1200}
            position="absolute"
          >
            <StoriesAnalyticsPopupDetails
              hydrographData={hydrographData}
              tableStatsData={tableStatsData}
              tableStatsInfo={tableStatsInfo}
              isDataLoading={isDataLoading}
              isTableStatsDataNull={isTableStatsDataNull}
              isHydrographDataNull={isHydrographDataNull}
            />
          </Box>
        </div>
      </div>
    </StoriesLayout>
  );
};

export default StreamflowExplorePage;
