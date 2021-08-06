import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// create styles
// create page styles
const styles = theme => ({
  root: {
    backgroundColor: `rgba(49,49,49,0.6)`,
    borderRadius: 4,
    position: `absolute`,
    zIndex: 1200,
    top: 73,
    left: 50,
    padding: 15,
    paddingTop: 0,
    paddingBottom: 0,
    maxWidth: 300,
  },
  legendTitle: {
    color: theme.palette.primary.main,
  },
  legendSubtitle: {
    color: `#ffffff`,
  },
  legendList: {
    marginBottom: 15,
  },
  legendListItem: {
    marginTop: 5,
    display: `flex`,
    color: `#ffffff`,
  },
  legendSymbolPoint: {
    border: `1.5px solid #333333`,
    borderRadius: `50%`,
    width: 20,
    height: 20,
  },
  legendText: {
    marginLeft: 5,
    fontSize: '0.8rem',
  },
  noDataText: {
    color: `#c2c2c2`,
    marginTop: 5,
  },
});

const Legend = ({ classes, legendColors }) => {
  return (
    <div className={clsx(classes.root, 'map-legend')}>
      <div className="mb6">
        <Typography variant="h6" color="secondary" className={classes.legendTitle}>
          Legend
        </Typography>
        <Typography variant="body1" className={classes.legendSubtitle}>
          Monitoring Points
        </Typography>
        <div className={classes.legendList}>
          {legendColors.map(data => (
            <div className={classes.legendListItem} key={data.name}>
              <div className={classes.legendSymbolPoint} style={{ backgroundColor: data.color }}></div>
              <div className={classes.legendText}>{data.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(Legend);
