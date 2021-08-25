import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// create styles
// create page styles
const styles = theme => ({
  root: {
    backgroundColor: `rgba(49,49,49,1)`,
    borderRadius: 4,
    zIndex: 1200,
    padding: 15,
    maxWidth: 300,
  },
  popoverTitle: {
    color: theme.palette.primary.main,
  },
  popoverSubtitle: {
    color: `#ffffff`,
  },
  popoverList: {
    // marginBottom: 15,
  },
  popoverListItem: {
    marginTop: 5,
    display: `flex`,
    color: `#ffffff`,
  },
  popoverSymbolPoint: {
    border: `1.5px solid #333333`,
    borderRadius: `50%`,
    width: 20,
    height: 20,
  },
  popoverText: {
    marginLeft: 5,
    fontSize: '0.8rem',
  },
  noDataText: {
    color: `#c2c2c2`,
    marginTop: 5,
  },
});

const BenchmarkPopover = ({ classes, data }) => {
  const popoverColors = [
    { name: `>${data.bmk_3_4} ${data.units}`, color: `#E28B8B` },
    { name: `${data.bmk_2_3} - ${data.bmk_3_4} ${data.units}`, color: `#FCD392` },
    { name: `${data.bmk_1_2} - ${data.bmk_2_3} ${data.units}`, color: `#FFF59D` },
    { name: `${data.bmk_0_1} - ${data.bmk_1_2} ${data.units}`, color: `#8AF9B2` },
    { name: `${data.parameter_abbrev} not detected`, color: `#90BFA1` },
  ];

  const popoverColorsReverse = [
    { name: `>${data.bmk_0_1} ${data.units}`, color: `#90BFA1` },
    { name: `${data.bmk_1_2} - ${data.bmk_0_1}  ${data.units}`, color: `#8AF9B2` },
    { name: `${data.bmk_2_3} - ${data.bmk_1_2} ${data.units}`, color: `#FFF59D` },
    { name: `${data.bmk_3_4} - ${data.bmk_2_3}  ${data.units}`, color: `#FCD392` },
    { name: `0 - ${data.bmk_3_4} ${data.units}`, color: `#E28B8B` },
  ];

  return (
    <div className={classes.root}>
      <div className="mb6">
        <Typography variant="h6" color="secondary" className={classes.popoverTitle}>
          {`${data.parameter_abbrev} Benchmarks`}
        </Typography>
        <div className={classes.popoverList}>
          {data.pctile_basis === 15
            ? popoverColorsReverse.map(el => (
                <div className={classes.popoverListItem} key={el.name}>
                  <div className={classes.popoverSymbolPoint} style={{ backgroundColor: el.color }}></div>
                  <div className={classes.popoverText}>{el.name}</div>
                </div>
              ))
            : popoverColors.map(el => (
                <div className={classes.popoverListItem} key={el.name}>
                  <div className={classes.popoverSymbolPoint} style={{ backgroundColor: el.color }}></div>
                  <div className={classes.popoverText}>{el.name}</div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(BenchmarkPopover);
