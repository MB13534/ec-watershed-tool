import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DetailsIcon from '@material-ui/icons/ListAlt';
import LandUseIcon from '@material-ui/icons/Terrain';
import ParcelsIcon from '@material-ui/icons/PhotoSizeSelectSmall';
import AqVulnIcon from '@material-ui/icons/Waves';
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
  }
}));

export default function AnalyticsPopupDetails({ map }) {
  const classes = useStyles();
  const theme = useTheme();
  const mapProvider = useMap();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const formatStatistic = (row) => {
    if (mapProvider.filters.analysisType === '85th percentile') {
      return row.stat_85;
    } else {
      return row.stat_median;
    }
  }

  const formatValue = (row) => {
    if (mapProvider.filters.analysisType === '85th percentile') {
      return <div className={classes.circle} style={{
        backgroundColor: mapProvider.getHexColorForScore(row.bval_85)
      }}>&nbsp;</div>
    } else {
      return <div className={classes.circle} style={{
        backgroundColor: mapProvider.getHexColorForScore(row.bval_median)
      }}>&nbsp;</div>
    }
  }

  const setTrendIcon = (trend) => {
    const val = trend ? trend.toLowerCase() : '';
    if (val === 'no trend') {
      return `swap_vert`;
    } else if (val.includes(`increasing`)) {
      return `arrow_upward`;
    } else if (val.includes(`decreasing`)) {
      return `arrow_downward`;
    } else if (val === 'stable') {
      return `trending_flat`
    } else if (val === `<4`) {
      return "not_interested"
    }
  }

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
      </Tabs>
      <TabPanel value={value} index={0}>
        <Divider />
        <Paper>
          <TableContainer style={{
            overflowY: 'scroll',
            maxHeight: '201px',
          }}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Parameter</TableCell>
                  <TableCell align="center">Statistic</TableCell>
                  <TableCell align="center">Value</TableCell>
                  <TableCell align="center">Trend</TableCell>
                  <TableCell align="center">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.analyticsResults.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.parameter_abbrev}
                    </TableCell>
                    <TableCell align="center">{formatStatistic(row)} mg/L</TableCell>
                    <TableCell align="center">{formatValue(row)}</TableCell>
                    <TableCell align="center">
                      <Icon>{setTrendIcon(row.trend)}</Icon><br/>
                      {row.trend}
                    </TableCell>
                    <TableCell align="center">{row.recordcount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Divider />
        <Paper>
          {(map.landUseData) &&
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Land Cover Type</TableCell>
                  <TableCell>Acres</TableCell>
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
          {(map.stationData) &&
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Location Name</TableCell>
                  <TableCell>Location Type</TableCell>
                  <TableCell>HUC12</TableCell>
                  <TableCell>HUC Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.stationData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.location_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.loc_type}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.huc12}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.huc_name}
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
