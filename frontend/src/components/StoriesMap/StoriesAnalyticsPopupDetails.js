import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import useTheme from '@material-ui/core/styles/useTheme';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import { HourglassEmpty } from '@material-ui/icons';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Grid, Card, List, ListItem, ListItemText, Divider, Button } from '@material-ui/core';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import DownloadIcon from '@material-ui/icons/GetApp';

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
  exportButton: {
    position: 'absolute',
    zIndex: 1,
    top: '20px',
    left: '10px',
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

  const tableStatsTitleLookup = {
    cumulative_af: 'Cumulative AF',
    highest_year_cumulative_af: 'Highest Year Cumulative AF',
    lowest_year_cumulative_af: 'Lowest Year Cumulative AF',
    median_year_cumulative_af: 'Median Year Cumulative AF',
    month_abbrev: 'Month Abbreviation',
    month_name: 'Month Name',
    pct_of_normal: 'Percentage of Normal',
    station_desc: 'Station Description',
    station_ndx: 'Station Index',
    usgs_site_no: 'USGS Site Number',
    watermonth: 'Water Month',
    wateryear: 'Water Year',
  };

  const handleExportClick = () => {
    const statsLookup1 = `"${tableStatsInfo[tableStatsData.station_ndx].lowest_year} Flows, Oct - ${
      tableStatsData.month_abbrev
    }"`;

    const statsLookup2 = `"${tableStatsInfo[tableStatsData.station_ndx].highest_year} Flows, Oct - ${
      tableStatsData.month_abbrev
    }"`;

    const tableStats = {
      Name: tableStatsData.station_desc,
      'USGS Gauge': tableStatsData.usgs_site_no,
      'Selected Water Year Statistics': `October - ${tableStatsData.month_name} ${tableStatsData.wateryear}`,
      'Cumulative Flows': tableStatsData.cumulative_af + ' AF',
      'Percent of Median': tableStatsData.pct_of_normal,
      'Period of Record':
        tableStatsInfo[tableStatsData.station_ndx].porminyear +
        ' - ' +
        tableStatsInfo[tableStatsData.station_ndx].pormaxyear,
      'Driest Year on Record':
        tableStatsInfo[tableStatsData.station_ndx].lowest_year +
        ' (' +
        convertToPercent(tableStatsData.lowest_year_cumulative_af, tableStatsData.median_year_cumulative_af) +
        '% of Med)',
      [statsLookup1]: tableStatsData.lowest_year_cumulative_af + ' AF',
      'Wettest Year on Record':
        tableStatsInfo[tableStatsData.station_ndx].highest_year +
        ' (' +
        convertToPercent(tableStatsData.highest_year_cumulative_af, tableStatsData.median_year_cumulative_af) +
        '% of Med)',
      [statsLookup2]: tableStatsData.highest_year_cumulative_af + ' AF',
      [[`"Median Flows, Oct - ${tableStatsData.month_abbrev}"`]]: tableStatsData.median_year_cumulative_af + ' AF',
      'For More Info': `https://waterdata.usgs.gov/nwis/inventory?agency_code=USGS&site_no=${tableStatsData.usgs_site_no}`,
    };

    const hydrographDataCsvString = [
      ['Table Stats Data'],
      ...Object.entries(tableStats).map(item => [item[0], '"' + item[1] + '"']),
      [],
      [],
      [],
      ['Hydrograph Data'],
      [`Selected Start Month: ${hydrographData[0].month_abbrev}`],
      [`Selected End Month: ${hydrographData[hydrographData.length - 1].month_abbrev}`],
      [
        'Date',
        'Daily Average CFS',
        `Wettest Year (${tableStatsInfo[tableStatsData.station_ndx].highest_year})`,
        `Driest Year (${tableStatsInfo[tableStatsData.station_ndx].lowest_year})`,
        `Record Median (${tableStatsInfo[tableStatsData.station_ndx].porminyear} - ${
          tableStatsInfo[tableStatsData.station_ndx].pormaxyear
        })`,
      ],
      ...hydrographData.map(item => [
        `"${item.month_num}/${item.dayofmonth}"`,
        item.flow_cfs,
        item.high_cfs,
        item.low_cfs,
        item.median_cfs,
      ]),
    ]
      .map(e => e.join(','))
      .join('\n');

    var a = document.createElement('a');
    a.href = 'data:attachment/csv,' + encodeURIComponent(hydrographDataCsvString);
    a.target = '_blank';
    a.download = `Daily Flow Hydrograph for ${tableStatsData.station_desc}.csv`;
    document.body.appendChild(a);
    a.click();
  };

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

  /*
  function convertToPercent(x, y) {
    return ((parseInt(x.trim()) / parseInt(y.trim())) * 100).toFixed(1);
  }
*/
  // KKC added replace function to remove commas - the parse function was
  // lopping off the number after the comma so a 3,456 for instance ended
  // up being just a 3 for the division
  function convertToPercent(x, y) {
    //  console.log(x.replace(",","").trim());
    return ((parseInt(x.replace(',', '').trim()) / parseInt(y.replace(',', '').trim())) * 100).toFixed(1);
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

      {hydrographData !== null &&
        hydrographData.length !== 0 &&
        tableStatsData !== null &&
        tableStatsData.length !== 0 && (
          <>
            {isDataLoading && <Loader />}

            <Paper style={{ position: 'relative' }}>
              <Button
                className={classes.exportButton}
                color="secondary"
                variant="outlined"
                disableElevation
                onClick={handleExportClick}
                startIcon={<DownloadIcon />}
                style={{
                  marginLeft: theme.spacing(1),
                }}
              >
                Export Selected Gauge
              </Button>
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
                        <Divider variant={'middle'} className={classes.divider} />
                        <Typography variant={'h6'} align={'center'}>
                          Selected Water Year Statistics: <br />
                          {`October - ${tableStatsData.month_name} ${tableStatsData.wateryear}`}
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
                          Period of Record Statistics:
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
                          <ListItemText>
                            {`${tableStatsInfo[tableStatsData.station_ndx].lowest_year} Flows, Oct - ${
                              tableStatsData.month_abbrev
                            }`}
                          </ListItemText>
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
                          <ListItemText>{`${tableStatsInfo[tableStatsData.station_ndx].highest_year} Flows, Oct - ${
                            tableStatsData.month_abbrev
                          }`}</ListItemText>
                          <ListItemText>{tableStatsData.highest_year_cumulative_af} AF</ListItemText>
                        </ListItem>
                        <ListItem className={classes.listItem}>
                          <ListItemText>For More Info</ListItemText>
                          <ListItemText>
                            <a
                              href={`https://waterdata.usgs.gov/nwis/inventory?agency_code=USGS&site_no=${tableStatsData.usgs_site_no}`}
                              target="_blank"
                              rel="noopener noreferrer"
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
