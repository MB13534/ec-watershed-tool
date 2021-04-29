import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DetailsIcon from '@material-ui/icons/ListAlt';
import LandUseIcon from '@material-ui/icons/Terrain';
import ParcelsIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import AqVulnIcon from '@material-ui/icons/Waves';
import RoomIcon from '@material-ui/icons/Room';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import useTheme from '@material-ui/core/styles/useTheme';
import { colors } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { useMap } from '../../pages/Map/MapProvider';
import Icon from '@material-ui/core/Icon';
import ResultsPopupDetails from './ResultsPopupDetails';
import Button from '@material-ui/core/Button';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box pt={2}>
          {children}
        </Box>
      )}
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
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
  }
}));

export default function AnalyticsPopupDetails({ map }) {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formatStatistic = (row) => {
    if (map.filters.analysisType === '85th percentile') {
      return row.stat_85;
    } else {
      return row.stat_median;
    }
  };

  const formatValue = (row) => {
    if (map.filters.analysisType === '85th percentile') {
      return <div className={classes.circle} style={{
        backgroundColor: map.getHexColorForScore(row.bval_85),
      }}>&nbsp;</div>;
    } else {
      return <div className={classes.circle} style={{
        backgroundColor: map.getHexColorForScore(row.bval_median),
      }}>&nbsp;</div>;
    }
  };

  useEffect(() => {
    map.map.on('mapPointClicked', () => {
      setValue(0);
    });
  }, []);

  const setTrendIcon = (trend) => {
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
    <div className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        aria-label="scrollable force tabs example"
      >
        <Tab label="Stats & Benchmarks" icon={<DetailsIcon />} {...a11yProps(0)} />
        <Tab label="Land Use" icon={<LandUseIcon />} {...a11yProps(1)} />
        <Tab label="Monitoring Locations" icon={<AqVulnIcon />} {...a11yProps(2)} />
        <Tab label="Nearby Results" icon={<RoomIcon />} {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Divider />
        <Paper>
          {(!map.analyticsResults) &&
          <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>Please
            select a monitoring location on the map above.</Typography>
          }
          {(map.analyticsResults) &&
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
                  }}>
                  <Icon>room</Icon>
                </div>
              <Typography variant={'body1'}><strong>{map.currentLocationData.location_1}</strong></Typography>
              <Typography variant={'body1'}>{map.currentLocationData.location_n}</Typography>
              </Box>
              <Divider/>
              <TableContainer style={{
                overflowY: 'scroll',
                maxHeight: '230px',
              }}>
                <Table className={classes.table} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell align="center">{map.filters.analysisType}</TableCell>
                      <TableCell align="center">Benchmark</TableCell>
                      <TableCell align="center">Trend</TableCell>
                      <TableCell align="center">Count</TableCell>
                      <TableCell align="center">Analysis POR</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {map.analyticsResults.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {row.parameter_abbrev}
                        </TableCell>
                        <TableCell align="center">{formatStatistic(row)} {row.units}</TableCell>
                        <TableCell align="center">{formatValue(row)}</TableCell>
                        <TableCell align="center">
                          <Icon>{setTrendIcon(row.trend)}</Icon><br />
                          {row.trend}
                        </TableCell>
                        <TableCell align="center">{row.recordcount}</TableCell>
                        <TableCell align="center">{row.analysis_period}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
          </>
          }
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Divider />
        <Paper>
          {(!map.geometryData.length) &&
          <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>Please draw
            an area to intersect on the map above.</Typography>
          }
          {(map.landUseData && map.geometryData.length > 0) &&
          <TableContainer style={{
            overflowY: 'scroll',
            maxHeight: '201px',
          }}>
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
                      {row.use_new}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.acres}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.total_acres}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.pct_of_total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          }
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Divider />
        <Paper>
          {(!map.geometryData.length) &&
          <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>Please draw
            an area to intersect on the map above.</Typography>
          }
          {(map.stationData && map.geometryData.length > 0) &&
          <TableContainer style={{
            overflowY: 'scroll',
            maxHeight: '201px',
          }}>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Location Name</TableCell>
                  <TableCell>Location Type</TableCell>
                  <TableCell>HUC Name</TableCell>
                  <TableCell>Period of Record</TableCell>
                  <TableCell>Available Parameters</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.stationData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <strong>{row.location_id}</strong><br/>
                      {row.location_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.loc_type}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.huc_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.por}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.params_c}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          }
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Divider />
        <Paper>
          {(!map.renderedPointData) &&
          <Typography variant={'body1'} align={'center'} style={{ margin: '20px auto', padding: '20px 0' }}>No
            monitoring points found with the selected constituents.</Typography>
          }
          {(map.renderedPointData) &&
          <TableContainer style={{
            overflowY: 'scroll',
            maxHeight: '201px',
          }}>
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
                        }}><Icon>room</Icon></div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <strong>{row.properties.location_1}</strong><br/>
                      {row.properties.location_n}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.properties.loc_type}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.parameters.map((x, i) =>
                        <div key={i} className={classes.badge}>{x}</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          }
        </Paper>
      </TabPanel>
    </div>
  );
}
