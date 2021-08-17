import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DetailsIcon from '@material-ui/icons/ListAlt';
import LandUseIcon from '@material-ui/icons/Terrain';
import AqVulnIcon from '@material-ui/icons/Waves';
import RoomIcon from '@material-ui/icons/Room';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import useTheme from '@material-ui/core/styles/useTheme';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import ParcelsIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import clsx from 'clsx';
import { HourglassEmpty } from '@material-ui/icons';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import { colors } from '@material-ui/core';
import HSBar from 'react-horizontal-stacked-bar-chart';
import numbro from 'numbro';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      style={{ position: 'relative', minHeight: '100px' }}
      {...other}
    >
      {value === index && <Box mt={2}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
  },
  circle: {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    borderRadius: '50%',
    margin: 'auto',
    color: 'white',
    lineHeight: '45px',
  },
  badge: {
    display: 'inline-block',
    padding: '4px',
    margin: '0 4px 4px 0',
    backgroundColor: '#ccc',
    color: '#555',
    borderRadius: '5px',
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
    maxHeight: '500px',
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
  colorPreviewBlock: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
    display: 'inline-block',
    verticalAlign: 'top',
    borderRadius: '4px',
  },
  hsBar: {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    overflow: 'hidden',
  },
}));

export default function AnalyticsPopupDetails({ map }) {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (map && map.map) {
      map.map.on('mapPointClicked', () => {
        setValue(0);
        map.setMapMode('analyze');
      });
    }
  }, [map]);

  useEffect(() => {
    if (map.mapMode === 'explore') {
      setValue(1);
    }
    if (map.mapMode === 'analyze') {
      setValue(0);
    }
  }, [map.mapMode]);

  const Loader = () => (
    <div className={classes.loader}>
      <div className={clsx(classes.overlayBg)}>
        <Box
          className={clsx(classes.queryLoadingFull, classes.queryLoadingOpen)}
          ml="60px"
          top="60px"
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

  const barChartColors = [
    { name: 'Agricultural Land', color: colors.green[400] },
    { name: 'Barren Land', color: colors.grey[400] },
    { name: 'Forest Land', color: colors.green[800] },
    { name: 'Rangeland', color: colors.yellow[400] },
    { name: 'Tundra', color: colors.orange[200] },
    { name: 'Urban or Built-Up Land', color: colors.purple[400] },
    { name: 'Water', color: colors.blue[800] },
    { name: 'Wetland', color: colors.blue[300] },
  ];

  const fallbackBarChartColors = [
    colors.purple[800],
    colors.purple[500],
    colors.purple[200],
    colors.orange[800],
    colors.orange[500],
    colors.indigo[800],
    colors.indigo[500],
    colors.indigo[200],
    colors.blue[800],
    colors.blue[500],
    colors.blue[200],
  ];

  const getChartColorByName = (name, index) => {
    let color = barChartColors.filter(x => x.name === name)?.[0]?.color;
    if (!color) color = fallbackBarChartColors[index];
    return color;
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
      >
        <Tab
          label="Stats & Benchmarks"
          style={{ display: map.mapMode === 'analyze' ? 'block' : 'none' }}
          icon={<DetailsIcon />}
          {...a11yProps(0)}
        />
        <Tab
          label="Land Use"
          style={{ display: map.mapMode === 'explore' ? 'block' : 'none' }}
          icon={<LandUseIcon />}
          {...a11yProps(1)}
        />
        <Tab
          label="Monitoring Locations"
          style={{ display: map.mapMode === 'explore' ? 'block' : 'none' }}
          icon={<AqVulnIcon />}
          {...a11yProps(2)}
        />
        <Tab
          label="Nearby Results"
          style={{ display: map.mapMode === 'analyze' ? 'block' : 'none' }}
          icon={<RoomIcon />}
          {...a11yProps(3)}
        />
        <Tab
          label="Parcels"
          style={{ display: map.mapMode === 'explore' ? 'block' : 'none' }}
          icon={<ParcelsIcon />}
          {...a11yProps(4)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Divider />
        <Paper>
          {!map.analyticsResults && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              Please select a monitoring location on the map above.
            </Typography>
          )}
          {map.analyticsResults && (
            <>
              <Box ml={2} pt={1} pb={1}>
                <div
                  className={classes.circle}
                  style={{
                    backgroundColor: theme.palette.primary.main,
                    float: 'left',
                    width: '50px',
                    height: '50px',
                    lineHeight: '66px',
                    marginRight: '13px',
                  }}
                >
                  <Icon>room</Icon>
                </div>
                <Typography variant={'body1'}>
                  <strong>{map.currentLocationData.location_1}</strong>
                </Typography>
                <Typography variant={'body1'}>{map.currentLocationData.location_n}</Typography>
              </Box>
              <Divider />
              <TableContainer
                style={{
                  overflowY: 'scroll',
                  maxHeight: '310px',
                }}
              >
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell align="center">{map.filters.analysisType}</TableCell>
                      <TableCell align="center">Benchmark</TableCell>
                      <TableCell align="center">Trend</TableCell>
                      <TableCell align="center">Count</TableCell>
                      <TableCell align="center">Analysis POR</TableCell>
                      <TableCell align="center">Time Series Graph</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {map.analyticsResults.map((row, index) => (
                      <TimeSeriesGraphRow row={row} key={index} map={map} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {map.isLandUseDataLoading && <Loader />}
        <Paper>
          {!map.geometryData.length && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              Please draw an area to intersect on the map above.
            </Typography>
          )}
          {!map.isLandUseDataLoading && map.geometryData && map.geometryData.length > 0 && !map.landUseData.length && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              No land use data found within the query area.
            </Typography>
          )}
          {map.landUseData && map.landUseData.length > 0 && map.geometryData.length > 0 && (
            <>
              <div className={classes.hsBar}>
                <HSBar
                  data={map.landUseData.map((row, index) => {
                    return {
                      value: parseFloat(row.pct_of_total),
                      color: getChartColorByName(row.use_new, index),
                      description: `${row.use_new} (${row.pct_of_total})`,
                    };
                  })}
                />
              </div>
              <TableContainer
                style={{
                  overflowY: 'scroll',
                  maxHeight: '230px',
                }}
              >
                <Table className={classes.table} size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Land Cover Type</TableCell>
                      <TableCell>Acres</TableCell>
                      <TableCell>Total Acres Selected</TableCell>
                      <TableCell>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {map.landUseData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          <Typography variant={'caption'}>
                            <div
                              className={classes.colorPreviewBlock}
                              style={{ backgroundColor: getChartColorByName(row.use_new, index) }}
                            />
                            {row.use_new}
                          </Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Typography variant={'caption'}>
                            {numbro(parseFloat(row.acres)).format({ thousandSeparated: true })}
                          </Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Typography variant={'caption'}>
                            {numbro(parseInt(row.total_acres)).format({ thousandSeparated: true })}
                          </Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Typography variant={'caption'}>{row.pct_of_total}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {map.isMonitoringLocationDataLoading && <Loader />}
        <Paper>
          {!map.geometryData.length && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              Please draw an area to intersect on the map above.
            </Typography>
          )}
          {!map.isMonitoringLocationDataLoading &&
            map.geometryData &&
            map.geometryData.length > 0 &&
            !map.stationData.length && (
              <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
                No monitoring location data found within the query area.
              </Typography>
            )}
          {map.stationData && map.stationData.length > 0 && map.geometryData.length > 0 && (
            <TableContainer
              style={{
                overflowY: 'scroll',
                maxHeight: '230px',
              }}
            >
              <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>HUC 12</TableCell>
                    <TableCell title={'Period of Record'}>POR</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map.stationData.map((station, index) => (
                    <StationTableRow row={station} key={index} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Divider />
        <Paper>
          {!map.renderedPointData && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              No monitoring points found with the selected constituents.
            </Typography>
          )}
          {map.renderedPointData && (
            <TableContainer
              style={{
                overflowY: 'scroll',
                maxHeight: '230px',
              }}
            >
              <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Benchmark</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Parameters</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map.renderedPointData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        <div
                          className={classes.circle}
                          style={{
                            backgroundColor: map.getHexColorForScore(row.score),
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            map.map.fire('closeAllPopups');

                            map.map.flyTo({ center: [row.properties.loc_long, row.properties.loc_lat], zoom: 12 });

                            setTimeout(() => {
                              map.map.fire('click', {
                                lngLat: [row.properties.loc_long, row.properties.loc_lat],
                                point: map.map.project([row.properties.loc_long, row.properties.loc_lat]),
                                originalEvent: {},
                              });
                            }, 1000);
                          }}
                        >
                          <Icon>room</Icon>
                        </div>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <strong>{row.properties.location_1}</strong>
                        <br />
                        {row.properties.location_n}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.properties.loc_type}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.parameters.map((x, i) => (
                          <div key={i} className={classes.badge}>
                            {x}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={4}>
        {map.isParcelDataLoading && <Loader />}
        <Paper>
          {!map.geometryData.length && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              Please draw an area to intersect on the map above.
            </Typography>
          )}
          {!map.isParcelDataLoading && map.geometryData && map.geometryData.length > 0 && !map.parcelData.length && (
            <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>
              No parcel data found within the query area.
            </Typography>
          )}
          {map.parcelData && map.parcelData.length > 0 && map.geometryData.length > 0 && (
            <TableContainer
              style={{
                overflowY: 'scroll',
                maxHeight: '201px',
              }}
            >
              <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Parcel Id</TableCell>
                    <TableCell>Schedule #</TableCell>
                    <TableCell>Acres</TableCell>
                    <TableCell>Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {map.parcelData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        <Typography variant={'caption'}>{row.parcel_id}</Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant={'caption'}>{row.schedule_n}</Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant={'caption'}>
                          {numbro(parseFloat(row.acres)).format({ thousandSeparated: true })}
                        </Typography>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant={'caption'}>
                          <a href={row.url} target={'_blank'}>
                            View
                          </a>
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
        {map.parcelData && map.geometryData.length > 0 && map.parcelData.length >= 100 && (
          <Typography variant="caption" align={'center'} style={{ display: 'block', marginTop: '4px' }}>
            Note: Results limited to 100 parcels. Reduce query area for more precise results.
          </Typography>
        )}
      </TabPanel>
    </div>
  );
}

const useRowStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  bookingDetails: {
    color: 'black',
    '& span': {
      color: '#666',
    },
  },
  badge: {
    display: 'inline-block',
    padding: '4px',
    margin: '0 4px 4px 0',
    backgroundColor: '#ccc',
    color: '#555',
    borderRadius: '5px',
  },
  circle: {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    borderRadius: '50%',
    margin: 'auto',
    color: 'white',
    lineHeight: '45px',
  },
}));

function TimeSeriesGraphRow(props) {
  const { row, map } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const theme = useTheme();

  //create the dataset for the time series graph
  const data = map.timeSeriesResults?.filter(r => r.parameter_index === row.parameter_index);
  //convert each date to int
  data.forEach(el => (el.activity_date = new Date(el.activity_date).getTime()));

  const formatStatistic = row => {
    if (map.filters.analysisType === '85th percentile') {
      return row.stat_85;
    } else {
      return row.stat_median;
    }
  };

  const formatValue = row => {
    if (map.filters.analysisType === '85th percentile') {
      return (
        <div
          className={classes.circle}
          style={{
            backgroundColor: map.getHexColorForScore(row.bval_85),
          }}
        >
          &nbsp;
        </div>
      );
    } else {
      return (
        <div
          className={classes.circle}
          style={{
            backgroundColor: map.getHexColorForScore(row.bval_median),
          }}
        >
          &nbsp;
        </div>
      );
    }
  };

  const setTrendIcon = trend => {
    const val = trend ? trend.toLowerCase() : '';
    if (val === 'no trend') {
      return `swap_vert`;
    } else if (val.includes(`increasing`)) {
      return `arrow_upward`;
    } else if (val.includes(`decreasing`)) {
      return `arrow_downward`;
    } else if (val === 'stable') {
      return `trending_flat`;
    } else if (val === `<4`) {
      return 'not_interested';
    }
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          {row.parameter_abbrev}
        </TableCell>
        <TableCell align="center">
          {formatStatistic(row)} {row.units}
        </TableCell>
        <TableCell align="center">{formatValue(row)}</TableCell>
        <TableCell align="center">
          <Icon>{setTrendIcon(row.trend)}</Icon>
          <br />
          {row.trend}
        </TableCell>
        <TableCell align="center">{row.recordcount}</TableCell>
        <TableCell align="center">{row.analysis_period}</TableCell>
        <TableCell align={'right'}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: '#eee' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Card style={{ margin: '12px' }}>
              <Typography variant={'h6'} align={'center'} style={{ padding: '10px 0' }}>
                Time Series
              </Typography>
              <ResponsiveContainer height={200}>
                <LineChart margin={{ top: 25, right: 75, bottom: 25, left: 75 }} data={data}>
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="data_value"
                    strokeWidth={3}
                    //blue
                    stroke="blue"
                    dot={true}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis
                    dataKey="activity_date"
                    type="number"
                    // minTickGap={25}
                    domain={['auto', 'auto']}
                    tickFormatter={unixTime => moment(unixTime).format('MMM Do YYYY')}
                  />
                  <YAxis label={{ value: `${row.parameter_abbrev}`, angle: -90, position: 'insideLeft' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function StationTableRow(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const theme = useTheme();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell component="th" scope="row">
          <Typography variant={'caption'}>
            <strong>{row.location_id}</strong>
            <br />
            {row.location_name}
          </Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant={'caption'}>{row.loc_type}</Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant={'caption'}>{row.huc_name}</Typography>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant={'caption'}>
            <span style={{ whiteSpace: 'nowrap' }}>{row.por.split(' - ')[0]} -</span>
            <br />
            <span style={{ whiteSpace: 'nowrap' }}>{row.por.split(' - ')[1]}</span>
          </Typography>
        </TableCell>
        <TableCell align={'right'}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: '#eee' }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container spacing={2} className={classes.bookingDetails}>
                <Grid item md={12}>
                  <Typography variant="caption" gutterBottom>
                    <strong>Available Parameters</strong>
                    <br />
                    {row.params_c.split(', ').map((x, i) => (
                      <div key={i} className={classes.badge}>
                        {x}
                      </div>
                    ))}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
