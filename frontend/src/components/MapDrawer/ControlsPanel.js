import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid } from '@material-ui/core';
import SubmitIcon from '@material-ui/icons/Forward';
import SaveIcon from '@material-ui/icons/Save';
import LoadIcon from '@material-ui/icons/Publish';
import Chips from '../Chips';
import { useMap } from '../../pages/Map/MapProvider';
import DateControl from '../DateControl';
import ScenarioDialog from '../ScenarioDialog/ScenarioDialog';

const useStyles = makeStyles(theme => ({
  root: {},
  btn: {
    margin: theme.spacing(1),
    width: '95%',
  },
  filterGroup: {
    marginTop: theme.spacing(),
    marginBottom: theme.spacing(2),
    marginLeft: 5,
  },
  label: {
    display: `block`,
    fontSize: 14,
    marginBottom: theme.spacing(),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    marginLeft: 5,
    minWidth: 120,
    maxWidth: 300,
  },
  multiSelectLabel: {
    marginBottom: `0!important`,
    color: '#ffffff',
    fontSize: 14,
  },
  multiSelect: {
    marginTop: `2px!important`,
    color: '#bbcbff',
  },
  input: {
    borderBottom: `1.5px solid #99bbff`,
    color: '#bbcbff',
  },
  inputIcon: {
    fill: '#99bbff!important',
  },
}));

const ControlsPanel = ({}) => {
  const context = useMap();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <div id="analysis-type-filter" className={classes.filterGroup}>
          <label className={classes.label}>Analysis</label>
          <Chips
            data={context.analysisTypes}
            valueField="display"
            displayField="display"
            handleChipClick={e =>
              context.handleFilters("analysisType", e.target.textContent)
            }
            type="analysis-type"
            activeChips={context.filters.analysisType}
          />
        </div>
      </Box>

      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <div id="priorities-filter" className={classes.filterGroup}>
          <label className={classes.label}>Parameter Group</label>
          <Chips
            data={context.priorities}
            valueField="priority_desc"
            displayField="priority_desc"
            handleChipClick={e =>
              context.handleFilters("priorities", e.target.textContent)
            }
            type="priority-type"
            activeChips={context.filters.priorities}
          />
        </div>
      </Box>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <div id="threats-filter" className={classes.filterGroup}>
          <label className={classes.label}>Categories</label>
          <Chips
            data={context.threats}
            valueField="threat_desc"
            displayField="threat_desc"
            handleChipClick={e =>
              context.handleFilters("threats", e.target.textContent)
            }
            type="threats"
            activeChips={context.filters.threats}
          />
        </div>
      </Box>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <div id="parameters-filter" className={classes.filterGroup}>
          <label className={classes.label}>Parameters</label>
          <Box mb={1}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={context.onSelectAllParameters}
                >
                  + Select All
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="small"
                  onClick={context.onSelectNoneParameters}
                >
                  - Select None
                </Button>
              </Grid>
            </Grid>
          </Box>
          {context.parameters.length === 0 && (
            <p>None</p>
          )}
          <Chips
            data={context.parameters}
            valueField="parameter_abbrev"
            displayField="parameter_abbrev"
            handleChipClick={e =>
              context.handleFilters("parameters", e.target.textContent)
            }
            type="parameters"
            activeChips={context.filters.parameters}
          />
        </div>
      </Box>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <DateControl
          name={'startDate'}
          label={'Start Date'}
          value={context.filters.startDate}
          onChange={(event) => context.handleFilters('startDate', event.target.value, true)}
        />
      </Box>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <DateControl
          name={'endDate'}
          label={'End Date'}
          value={context.filters.endDate}
          onChange={(event) => context.handleFilters('endDate', event.target.value, true)}
        />
      </Box>
      <Box p={2} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <ScenarioDialog isOpen={context.scenarioDialogIsOpen} mode={context.scenarioDialogMode}/>
        <label className={classes.label}>Scenarios</label>
        <Box mb={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Button
                color="secondary"
                variant="outlined"
                disableElevation
                onClick={context.handleScenarioLoadClick}
                fullWidth
                size="small"
                startIcon={<LoadIcon />}
              >
                Load
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                color="secondary"
                variant="outlined"
                disableElevation
                onClick={context.handleScenarioSaveClick}
                fullWidth
                size="small"
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box p={1} bgcolor="#f5f5f6" borderBottom="1px solid #dddddd">
        <Button
          color="secondary"
          variant="contained"
          disableElevation
          onClick={context.handleControlsSubmit}
          className={classes.btn}
          startIcon={<SubmitIcon />}
        >
          Recalculate
        </Button>
      </Box>
    </div>
  );
};

export default ControlsPanel;
