import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { checkActive } from '../../utils';
import { useAuth0 } from '../../hooks/useAuth0';
import logo from '../../images/logo-ec.svg';
import clsx from 'clsx';
import Flex from '../Flex/Flex';
import useTheme from '@material-ui/core/styles/useTheme';
import MonthPicker from '../FilterBar/MonthPicker';
import YearPicker from '../FilterBar/YearPicker';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: `relative`,
    zIndex: 1,
  },
  logo: {
    width: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    '& img': {
      maxWidth: '100%',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: theme.palette.brand.primary,
    marginLeft: theme.spacing(1),
    fontSize: '1.7rem',
    fontWeight: 300,
  },
  activeLink: {
    color: `#ffffff`,
    backgroundColor: `rgba(0, 0, 0, 0.2)`,
    fontSize: 17,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    borderRadius: 4,
    textDecoration: `none`,
    '&:hover': {
      backgroundColor: `rgba(0, 0, 0, 0.2)`,
      textDecoration: `none`,
    },
    cursor: 'pointer',
  },
  link: {
    color: `#ffffff`,
    fontSize: 17,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
    borderRadius: 4,
    textDecoration: `none`,
    '&:hover': {
      backgroundColor: `rgba(255, 255, 255, 0.2)`,
      textDecoration: `none`,
    },
    cursor: 'pointer',
  },
  menu: {
    zIndex: 99999,
  },
  menuItem: {
    cursor: 'pointer',
  },
  subNav: {
    backgroundColor: theme.palette.primary['50'],
    borderBottom: `1px solid ${theme.palette.primary['100']}`,
    '& .MuiOutlinedInput-input': {
      padding: '10.5px 14px',
    },
    paddingLeft: '12px',
    paddingRight: '12px',
    justifyContent: 'space-between',
  },
}));

const TopNavStories = ({ waterYear, startMonth, endMonth, setWaterYear, setStartMonth, setEndMonth }) => {
  const classes = useStyles();
  let history = useHistory();

  const theme = useTheme();
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  /**
   * Assign appropriate class name to menu item based
   * on if menu item is active or not
   * @param {*} url
   */
  const handleActive = (url, exact) => {
    const active = checkActive(history, url, exact);
    if (active) {
      return classes.activeLink;
    }
    return classes.link;
  };

  // Configure sidebar menu items
  const MenuItems = [
    {
      link: 'map',
      title: 'Map',
      activePath: 'map',
      exact: true,
      loginRequired: true,
    },
    {
      link: 'stories',
      title: 'Stories',
      activePath: 'stories',
      exact: true,
      loginRequired: true,
    },
  ];

  const returnMenuItem = (item, isAuthenticated, user) => {
    let li = null;

    li = (
      <Link key={item.link} component={RouterLink} to={item.link} className={handleActive(item.activePath, item.exact)}>
        {item.title}
      </Link>
    );

    if (item.loginRequired && item.rolesRequired && user) {
      let roleSwitch = false;
      const roles = [...item.rolesRequired];
      roles.forEach(role => {
        if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
          roleSwitch = true;
        }
      });
      if (isAuthenticated && roleSwitch) {
        return li;
      }
    } else if (item.loginRequired) {
      if (isAuthenticated) {
        return li;
      }
    } else {
      return li;
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <div className={classes.logo}>
            <img src={logo} alt="Eagle County Watershed Tool" />
          </div>
          <Typography variant="h6" className={classes.title}>
            <span style={{ fontWeight: 'bold' }}>Eagle County</span> Watershed Tool
          </Typography>

          {MenuItems.map(item => returnMenuItem(item, isAuthenticated, user))}
          {isAuthenticated ? (
            <Link className={handleActive('/logout')} onClick={() => logout()}>
              Logout
            </Link>
          ) : (
            <Link className={handleActive('/login')} onClick={() => loginWithRedirect()}>
              Login
            </Link>
          )}
        </Toolbar>
        <Toolbar className={clsx(classes.subNav, 'subnav')}>
          <Flex justifyContent={'start'}></Flex>
          <Flex justifyContent={'end'}>
            <YearPicker
              endpoint="usgs/years"
              selectedDataSource={waterYear}
              onDataSourceChange={setWaterYear}
              id={'WaterYearPicker'}
              label={'Water Year'}
              placeholder={'Year'}
            />
            <MonthPicker
              endpoint="usgs/months"
              selectedDataSource={startMonth}
              onDataSourceChange={setStartMonth}
              id={'StartMonthPicker'}
              label={'Start Month'}
              placeholder={'Start'}
            />
            <MonthPicker
              endpoint="usgs/months"
              selectedDataSource={endMonth}
              onDataSourceChange={setEndMonth}
              id={'EndMonthPicker'}
              label={'End Month'}
              placeholder={'End'}
            />
          </Flex>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopNavStories;