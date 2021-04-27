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
}));

const formatWeight = (value) => {
  return parseInt(value * 100) + '%';
};

export default function ScrollableTabsButtonForce({ map }) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const prepareMinMaxAvgValues = (str) => {
    if (str && str.length > 0) {
      let groups = str.split(', ');
      return (
        <Grid container spacing={0}>
          <Grid item xs={4} align={'left'} style={{alignSelf: 'flex-end'}}>
            <Typography variant={'h6'}>{groups[0].split(' ')[1]}</Typography>
            {groups[0].split(' ')[0]}
          </Grid>
          <Grid item xs={4} align={'center'}>
            <Typography variant={'h4'}>{groups[2].split(' ')[1]}</Typography>
            {groups[2].split(' ')[0]}
          </Grid>
          <Grid item xs={4} align={'right'} style={{alignSelf: 'flex-end'}}>
            <Typography variant={'h6'}>{groups[1].split(' ')[1]}</Typography>
            {groups[1].split(' ')[0]}
          </Grid>
        </Grid>
      );
    } else {
      return '';
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
        <Tab label="Detailed Results" icon={<DetailsIcon />} {...a11yProps(0)} />
        <Tab label="Land Use" icon={<LandUseIcon />} {...a11yProps(1)} />
        <Tab label="Parcels" icon={<ParcelsIcon />} {...a11yProps(2)} />
        <Tab label="Aquifer Vulnerability" icon={<AqVulnIcon />} {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Divider />
        <Paper>
          <TableContainer>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Input Description</TableCell>
                  <TableCell align="center">Weight</TableCell>
                  <TableCell align="center">Scenario Risk</TableCell>
                  <TableCell align="center">Background Risk</TableCell>
                  <TableCell align="center">Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.queryResults.detailsData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.input_category}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.input_description}
                    </TableCell>
                    <TableCell align="center">{formatWeight(row.wt)}</TableCell>
                    <TableCell align="center">{row.scenario_risk}</TableCell>
                    <TableCell align="center">{row.baseline_risk}</TableCell>
                    <TableCell align="center">{row.delta}</TableCell>
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
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Land Cover Type</TableCell>
                  <TableCell>Modeled Current Conditions</TableCell>
                  <TableCell>Selected Scenario</TableCell>
                  <TableCell>Acres</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.queryResults.detailsLandUseData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.use_new}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.background_landuse}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.scenario_landuse}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.acres}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Divider />
        <Paper>
          <TableContainer>
            <Table className={classes.table} size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Parcel Id</TableCell>
                  <TableCell>Owner Name</TableCell>
                  <TableCell>Tenant Name</TableCell>
                  <TableCell>Cert Doc</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map.queryResults.detailsParcelsData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.parcel_id}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.own_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.tenant_nam}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.cert_doc}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Divider style={{ marginBottom: theme.spacing(4) }} />
        <Paper>
          <Box p={2}>
          {map.queryResults.detailsAqVulnData.map((row, index) => (
            <Grid container spacing={4} key={index}>
              <Grid item xs={12} style={{textAlign:'center'}}>
                <Typography variant={'caption'} align={'center'} gutterBottom>
                  {row.intersection_info}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant={'subtitle2'} style={{ color: colors.blueGrey[500] }} align={'center'} gutterBottom>
                  {row.dtgw_heading}
                </Typography>
                <Box pl={10} pr={10}>
                  {prepareMinMaxAvgValues(row.dtgw_values)}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant={'subtitle2'} style={{ color: colors.blueGrey[500] }} align={'center'} gutterBottom>
                  {row.clayth_heading}
                </Typography>
                <Box pl={10} pr={10}>
                  {prepareMinMaxAvgValues(row.clayth_values)}
                </Box>
              </Grid>
            </Grid>
          ))}
          </Box>
        </Paper>
      </TabPanel>
    </div>
  );
}
