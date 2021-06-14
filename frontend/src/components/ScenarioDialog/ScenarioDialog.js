import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import { useMap } from '../../pages/Map/MapProvider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import moment from 'moment-timezone';
import Paper from '@material-ui/core/Paper';
import useTheme from '@material-ui/core/styles/useTheme';
import FormHelperText from '@material-ui/core/FormHelperText';
import axios from 'axios';
import { useAuth0 } from '../../hooks/useAuth0';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Flex from '../Flex/Flex';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { ExpandMore } from '@material-ui/icons';
import AccordionDetails from '@material-ui/core/AccordionDetails';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: 0,
    minWidth: 120,
    width: '100%',
  },
  preview: {
    '& li:first-child:not(.accordion)': {
      border: 'none',
      marginTop: 0,
      paddingTop: 0,
    },
    '& li:not(.accordion)': {
      marginTop: theme.spacing(1),
      paddingTop: theme.spacing(1),
      borderTop: '1px solid #ccc',
    },
    '& li:not(.accordion) span': {
      backgroundColor: '#bbb',
      color: 'white',
      borderRadius: '4px',
      padding: '2px 4px',
      display: 'inline-block',
      marginRight: '4px',
      marginBottom: '4px',
      fontSize: '12px',
    },
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function CustomizedDialogs({
                                            isOpen = false,
                                            mode = 'save',
                                          }) {

  const { getTokenSilently } = useAuth0();
  const context = useMap();
  const theme = useTheme();
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(isOpen);
  const [scenarioName, setScenarioName] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingScenarioData, setExistingScenarioData] = useState([]);
  const [existingScenario, setExistingScenario] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOpen(isOpen);
    if (isOpen) {
      loadScenarios();
    }
  }, [isOpen]);

  const loadScenarios = () => {
    async function load() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const query = await axios.get(`${process.env.REACT_APP_ENDPOINT}/api/user-scenario`, { headers });
        setExistingScenarioData(query.data);
        if (query.data.length > 0 && existingScenario === '') {
          setExistingScenario(query.data[0]?.user_scenario_ndx);
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    load();
  };

  const handleClose = () => {
    context.setScenarioDialogIsOpen(false);
  };

  const handleSaveClick = () => {
    context.setSnackbarMessage('Scenario saved successfully!', 'Unable to save scenario.');

    if (value === 0) { // new
      if (!scenarioName || !scenarioName.trim().length) {
        setError(true);
        setErrorMessage('Please provide a scenario name.');
      } else {
        setError(false);
        setErrorMessage('');

        async function save() {
          try {
            context.setWaitingState('in progress');
            const token = await getTokenSilently();
            const headers = { Authorization: `Bearer ${token}` };
            const query = await axios.post(
              `${process.env.REACT_APP_ENDPOINT}/api/user-scenario`,
              {
                name: scenarioName,
                json_data: JSON.stringify(context.filters),
                start_date: context.filters.startDate,
                end_date: context.filters.endDate,
                geometry: context.geometryData[0]?.geometry,
                visible_layers: JSON.stringify(context.visibleLayers.filter(x => x.visible).map(x => x.id)),
              },
              { headers },
            );

            if (query.data) {
              setExistingScenario(query.data.user_scenario_ndx);
              setValue(1);
              context.setWaitingState('complete', 'no error');
            }
          } catch (err) {
            context.setWaitingState('complete', 'error');
            // Is this error because we cancelled it ourselves?
            if (axios.isCancel(err)) {
              console.log(`call was cancelled`);
            } else {
              console.error(err);
            }
          }
        }

        save();

        context.setScenarioDialogIsOpen(false);
      }
    }
    if (value === 1) { // overwrite
      async function overwrite() {
        try {
          context.setWaitingState('in progress');
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          const query = await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/user-scenario/${existingScenario}`,
            {
              json_data: JSON.stringify(context.filters),
              start_date: context.filters.startDate,
              end_date: context.filters.endDate,
              geometry: context.geometryData[0]?.geometry,
              visible_layers: JSON.stringify(context.visibleLayers.filter(x => x.visible).map(x => x.id)),
            },
            { headers },
          );

          if (query.data) {
            context.setWaitingState('complete', 'no error');
            console.log('save success!');
          }
        } catch (err) {
          context.setWaitingState('complete', 'error');
          // Is this error because we cancelled it ourselves?
          if (axios.isCancel(err)) {
            console.log(`call was cancelled`);
          } else {
            console.error(err);
          }
        }
      }

      overwrite();
      context.setScenarioDialogIsOpen(false);
    }
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleExistingScenarioChange = (event) => {
    setExistingScenario(event.target.value);
  };

  const handleNameChange = (event) => {
    setScenarioName(event.target.value);
  };

  const handleDeleteClick = (ndx) => {
    async function remove() {
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const query = await axios.delete(
          `${process.env.REACT_APP_ENDPOINT}/api/user-scenario/${ndx}`,
          { headers },
        );

        if (query.data) {
          loadScenarios();
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }

    if (window.confirm('Are you sure you want to delete this scenario?')) {
      remove();
    }
  };

  const handleLoadClick = (ndx) => {
    async function load() {
      try {
        context.setSnackbarMessage('Scenario loaded successfully!', 'Unable to load scenario.');
        context.setWaitingState('in progress');
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const query = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/api/user-scenario/${ndx}`,
          { headers },
        );

        if (query.data) {
          setExistingScenario(ndx);
          context.setFilters(JSON.parse(query.data.json_data));
          context.handleRefresh();
          context.setScenarioDialogIsOpen(false);
          context.triggerLoadGeometryData([{ geometry: query.data.geometry }]);
          context.updateVisibleLayers(JSON.parse(query.data.visible_layers));
          context.setWaitingState('complete', 'no error');
        }
      } catch (err) {
        context.setWaitingState('complete', 'error');
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
      }
    }

    load();
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}
              style={{ marginTop: '128px' }}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Scenario
        </DialogTitle>
        {mode === 'save' && (
          <DialogContent dividers>
            <Tabs value={value} onChange={handleChange} aria-label="New or Overwrite" centered>
              <Tab label="Create New Scenario" {...a11yProps(0)} />
              <Tab label="Overwrite Existing Scenario" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Typography variant={'body1'} align={'center'} gutterBottom>Create a new scenario with the following
                data:</Typography>
              <TextField id="outlined-basic" label="Scenario Name" variant="outlined" value={scenarioName} fullWidth
                         error={error} onChange={handleNameChange} style={{ marginTop: theme.spacing(1) }} />
              {error && <Box pl={1} pr={1}><FormHelperText error>{errorMessage}</FormHelperText></Box>}
              <Paper style={{ backgroundColor: '#e0e0e0', marginBottom: 0 }}>
                <ul className={classes.preview}
                    style={{ padding: theme.spacing(2), listStyleType: 'none', marginBottom: 0 }}>
                  <li>
                    <Grid container>
                      <Grid item xs={6}>
                        <strong>Analysis</strong><br />{context.filters.analysisType}
                      </Grid>
                      <Grid item xs={6}>
                        <strong>Date
                          Range</strong><br />{moment(context.filters.startDate).format('l')} - {moment(context.filters.endDate).format('l')}
                      </Grid>
                    </Grid>
                  </li>
                  <li className={'accordion'} style={{ paddingTop: theme.spacing(1) }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography className={classes.heading}>Scenario Details</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <ul style={{listStyleType: 'none', padding: 0}}>
                          <li><strong>Parameter Groups</strong><br />{context.filters.priorities.map(x =>
                            <span>{x}</span>)}</li>
                          <li><strong>Categories</strong><br />{context.filters.threats.map(x => <span>{x}</span>)}</li>
                          <li><strong>Parameters</strong><br />{context.filters.parameters.map(x => <span>{x}</span>)}
                          </li>
                          <li><strong>Visible
                            Layers</strong><br />{Object.values(context.visibleLayers).filter(x => x.visible).map(x =>
                            <span>{x.name}</span>)}</li>
                        </ul>
                      </AccordionDetails>
                    </Accordion>
                  </li>
                </ul>
              </Paper>
            </TabPanel>
            {isLoading && (
              <TabPanel value={value} index={1}>
                <Typography variant={'body1'} align={'center'}>
                  Loading, please wait...
                </Typography>
              </TabPanel>
            )}
            {!isLoading && existingScenarioData.length === 0 && (
              <TabPanel value={value} index={1}>
                <Typography variant={'body1'} align={'center'}>
                  You do not have any existing scenarios saved.
                </Typography>
              </TabPanel>
            )}
            {!isLoading && existingScenarioData.length > 0 && (
              <TabPanel value={value} index={1}>
                <Typography variant={'body1'} gutterBottom>
                  Overwrite the following scenario:
                </Typography>
                <FormControl variant="outlined" className={classes.formControl} style={{ marginTop: theme.spacing(2) }}>
                  <InputLabel id="existing-scenario-label">Scenario</InputLabel>
                  <Select
                    labelId="existing-scenario-label"
                    id="existing-scenario"
                    value={existingScenario}
                    onChange={handleExistingScenarioChange}
                    label="Scenario"
                    fullWidth
                  >
                    {existingScenarioData.map(x =>
                      <MenuItem key={x.user_scenario_ndx} value={x.user_scenario_ndx}>{x.name}</MenuItem>,
                    )}
                  </Select>
                </FormControl>
              </TabPanel>
            )}
          </DialogContent>
        )}
        {mode === 'load' && (
          <DialogContent dividers>
            {isLoading && (
              <Typography variant={'body1'} align={'center'}>
                Loading, please wait...
              </Typography>
            )}
            {!isLoading && existingScenarioData.length === 0 && (
              <Typography variant={'body1'} align={'center'}>
                You do not have any existing scenarios saved.
              </Typography>
            )}
            {!isLoading && existingScenarioData.length > 0 && (
              <>
                <Typography variant={'body1'} gutterBottom style={{ marginBottom: theme.spacing(2) }}>
                  Select a scenario to load:
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} size="small" aria-label="scenario table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Created</TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {existingScenarioData.map((row) => (
                        <TableRow
                          key={row.user_scenario_ndx}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="left">
                            <IconButton
                              variant={'outlined'}
                              onClick={() => {
                                handleDeleteClick(row.user_scenario_ndx);
                              }}
                              size={'small'}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.name}
                          </TableCell>
                          <TableCell
                            align="right">{moment(row.created_timestamp).tz('America/Denver').fromNow()}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant={'contained'}
                              color={'primary'}
                              onClick={() => {
                                handleLoadClick(row.user_scenario_ndx);
                              }}
                              disableElevation
                              size={'small'}
                            >
                              Load
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </DialogContent>
        )}
        {mode === 'save' && (
          <DialogActions>
            <Button autoFocus onClick={handleSaveClick} color="primary">
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}