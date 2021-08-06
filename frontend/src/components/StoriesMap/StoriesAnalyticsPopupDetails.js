import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import useTheme from '@material-ui/core/styles/useTheme';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { HourglassEmpty } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid, Card, List, ListItem, ListItemText, Divider } from '@material-ui/core';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
  },
  listItem: {
    '& > .MuiListItemText-root:nth-child(1)': {
      width: '50%',
      textAlign: 'right',
      marginRight: theme.spacing(2),
    },
    '& > .MuiListItemText-root:nth-child(2)': {
      width: '50%',
      textAlign: 'left',
      color: theme.palette.text.secondary,
    },
  },
  queryLoadingFull: {
    width: 'calc(100% - 120px - 20px)',
    marginTop: 'calc(64px + 10px)',
    '& .MuiAlert-root': {
      backgroundColor: 'rgba(255,255,255,.85)',
    },
  },
  queryLoadingOpen: {
    height: 'auto',
    maxHeight: '400px',
    width: '180px',
    top: 'calc(50% - 35px)',
    left: 'calc(50% - 90px)',
    margin: 0,
    transition: theme.transitions.create('max-height', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  overlayBg: {
    background: 'rgba(0,0,0,.12)',
    backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1300,
    borderRadius: '4px',
  },

  hsBar: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    overflow: 'hidden',
  },
}));

export default function StoriesAnalyticsPopupDetails({
  hydrographData,
  tableStatsData,
  tableStatsInfo,
  isDataLoading,
  isHydrographDataNull,
  isTableStatsDataNull,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const Loader = () => (
    <div className={classes.loader}>
      <div className={clsx(classes.overlayBg)}>
        <Box
          className={clsx(classes.queryLoadingFull, classes.queryLoadingOpen)}
          ml="30px"
          top="30px"
          zIndex={1400}
          position="absolute"
        >
          <Alert
            severity="info"
            icon={
              <HourglassEmpty
                style={{
                  width: '1.7em',
                  height: '1.7em',
                  animation: 'rotation 2s infinite linear',
                }}
              />
            }
          >
            <span>
              <strong style={{ fontSize: '16px' }}>Loading</strong>
              <br />
              Please wait... &nbsp;{' '}
            </span>
          </Alert>
        </Box>
      </div>
    </div>
  );

  function convertToPercent(x, y) {
    return ((parseInt(x.trim()) / parseInt(y.trim())) * 100).toFixed(1);
  }

  return (
    <>
      {isTableStatsDataNull && isHydrographDataNull && (
        <Alert severity="error" elevation={5}>
          <AlertTitle>Error</AlertTitle>
          <strong>No data available at this USGS Streamflow Station!</strong> — Please try again
        </Alert>
      )}

      {(isHydrographDataNull ? !isTableStatsDataNull : isTableStatsDataNull) && (
        <Alert severity="warning" elevation={5}>
          <AlertTitle>Warning</AlertTitle>
          <strong>Some data is missing from this USGS Streamflow Station!</strong> — Please check your query
        </Alert>
      )}

      {isHydrographDataNull === '' && isTableStatsDataNull === '' && (
        <Alert severity="info" elevation={5}>
          <AlertTitle>Info</AlertTitle>
          <strong>No data available!</strong> — Please select a USGS Streamflow Station
        </Alert>
      )}

      {hydrographData != null && hydrographData.length != 0 && tableStatsData != null && tableStatsData.length != 0 && (
        <>
          {isDataLoading && <Loader />}

          <Paper elevation={2}>
            <Grid container elevation={0} className={classes.root}>
              <Grid item xs={8}>
                <Card style={{ margin: '12px' }}>
                  <Typography variant={'h6'} align={'center'} style={{ padding: '10px 0' }}>
                    Daily Flow Hydrograph
                  </Typography>

                  <ResponsiveContainer height={332}>
                    <LineChart data={hydrographData}>
                      <Legend verticalAlign="bottom" align="center" />
                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="flow_cfs"
                        strokeWidth={3}
                        //blue
                        stroke="blue"
                        dot={false}
                        name={'Daily Average CFS'}
                      />
                      <Line
                        type="monotone"
                        dataKey="high_cfs"
                        strokeWidth={3}
                        //green
                        stroke="green"
                        dot={false}
                        name={'Wettest Year'}
                      />
                      <Line
                        type="monotone"
                        dataKey="low_cfs"
                        strokeWidth={3}
                        //yellow
                        stroke="#999900"
                        dot={false}
                        name={'Driest Year'}
                      />
                      <Line
                        type="monotone"
                        dataKey="median_cfs"
                        strokeWidth={3}
                        //dark grey
                        stroke="#2F4F4F"
                        dot={false}
                        name={'Record Median'}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="x_axis_label" minTickGap={25} />
                      <YAxis label={{ value: 'CFS', angle: -90, position: 'insideLeft' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card
                  style={{
                    overflowY: 'scroll',
                    maxHeight: '384px',
                    margin: '12px',
                  }}
                >
                  <Typography variant={'h6'} align={'center'}>
                    {tableStatsData.station_desc}
                  </Typography>
                  <Typography variant={'h6'} align={'center'} style={{ color: theme.palette.text.secondary }}>
                    {tableStatsData.usgs_site_no}
                  </Typography>
                  <Grid item xs={12}>
                    <List dense>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Selected Water Year</ListItemText>
                        <ListItemText>{tableStatsData.wateryear}</ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Through the Month of</ListItemText>
                        <ListItemText>{tableStatsData.month_name}</ListItemText>
                      </ListItem>
                      <Divider variant={'middle'} className={classes.divider} />
                      <Typography variant={'h6'} align={'center'}>
                        Selected Period Statistics
                      </Typography>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Cumulative Flows</ListItemText>
                        <ListItemText>{tableStatsData.cumulative_af} AF</ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Percent of Median</ListItemText>
                        <ListItemText>{tableStatsData.pct_of_normal}</ListItemText>
                      </ListItem>
                      <Divider variant={'middle'} className={classes.divider} />
                      <Typography variant={'h6'} align={'center'}>
                        Period of Record Statistics
                      </Typography>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Period of Record</ListItemText>
                        <ListItemText>
                          {tableStatsInfo[tableStatsData.station_ndx].porminyear} -{' '}
                          {tableStatsInfo[tableStatsData.station_ndx].pormaxyear}
                        </ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Driest Year on Record</ListItemText>
                        <ListItemText>
                          {tableStatsInfo[tableStatsData.station_ndx].lowest_year} (
                          {convertToPercent(
                            tableStatsData.lowest_year_cumulative_af,
                            tableStatsData.median_year_cumulative_af
                          )}
                          % of Med)
                        </ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Flows through {tableStatsData.month_name}</ListItemText>
                        <ListItemText>{tableStatsData.lowest_year_cumulative_af} AF</ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Wettest Year on Record</ListItemText>
                        <ListItemText>
                          {tableStatsInfo[tableStatsData.station_ndx].highest_year} (
                          {convertToPercent(
                            tableStatsData.highest_year_cumulative_af,
                            tableStatsData.median_year_cumulative_af
                          )}
                          % of Med)
                        </ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>Flows through {tableStatsData.month_name}</ListItemText>
                        <ListItemText>{tableStatsData.highest_year_cumulative_af} AF</ListItemText>
                      </ListItem>
                      <ListItem className={classes.listItem}>
                        <ListItemText>For More Info</ListItemText>
                        <ListItemText>
                          <a
                            href={`https://waterdata.usgs.gov/nwis/inventory?agency_code=USGS&site_no=${tableStatsData.usgs_site_no}`}
                            target="_blank"
                          >
                            {tableStatsData.usgs_site_no}
                          </a>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </>
  );
}
