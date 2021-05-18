import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import loading from '../../images/loading.svg';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    '& img': {
      maxWidth: 150,
    },
  },
}));

const Loading = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img src={loading} alt="loading" />
    </div>
  );
};

export default Loading;
