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

import MonthPicker from '../FilterBar/MonthPicker';
import YearPicker from '../FilterBar/YearPicker';
import MenuItem from '@material-ui/core/MenuItem';
import { Button, Menu } from '@material-ui/core';
import DownloadIcon from '@material-ui/icons/GetApp';
import useTheme from '@material-ui/core/styles/useTheme';
import axios from 'axios';

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

const TopNavStories = ({
  tableStatsInfo,
  waterYear,
  startMonth,
  endMonth,
  setWaterYear,
  setStartMonth,
  setEndMonth,
}) => {
  const classes = useStyles();
  let history = useHistory();
  const theme = useTheme();
  const { getTokenSilently } = useAuth0();

  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goTo = route => {
    history.push(`/${route}`);
    localStorage.setItem('last_url', history.location.pathname);
  };

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
      title: 'Stories',
      activePath: 'stories',
      children: [
        {
          link: 'streamflow-explore',
          title: 'Streamflow Explore',
          activePath: 'streamflow-explore',
          rolesRequired: false,
          exact: true,
          loginRequired: true,
        },
        {
          link: 'resources-links',
          title: 'Resources & Links',
          activePath: 'resources-links',
          rolesRequired: false,
          exact: true,
          loginRequired: true,
        },
      ],
    },
  ];

  const returnMenuItem = (item, isAuthenticated, user) => {
    let li = null;

    if (!item.children) {
      li = (
        <Link
          key={item.link}
          component={RouterLink}
          to={item.link}
          className={handleActive(item.activePath, item.exact)}
        >
          {item.title}
        </Link>
      );
    } else {
      li = (
        <Link key={item.link} onClick={handleClick} className={handleActive(item.activePath, item.exact)}>
          {item.title}
        </Link>
      );
    }

    if (item.children) {
      const children = item.children.map(child => {
        let cli = (
          <MenuItem
            className={(handleActive(item.activePath, item.exact), classes.menuItem)}
            key={child.link}
            onClick={() => {
              goTo(child.link);
              handleClose();
            }}
          >
            {child.title}
          </MenuItem>
        );

        if (child.loginRequired && child.rolesRequired && user) {
          let roleSwitch = false;
          const roles = [...child.rolesRequired];
          roles.forEach(role => {
            if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
              roleSwitch = true;
            }
          });
          if (isAuthenticated && roleSwitch) {
            return cli;
          }
        } else if (child.loginRequired) {
          if (isAuthenticated) {
            return cli;
          }
        } else {
          return cli;
        }

        return null;
      });

      li = (
        <div key={item.title}>
          {li}
          <Menu
            className={classes.menu}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            style={{ zIndex: 1500 }}
          >
            {children}
          </Menu>
        </div>
      );
    }

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

  function convertToPercent(x, y) {
    //  console.log(x.replace(",","").trim());
    return ((parseInt(x.replace(',', '').trim()) / parseInt(y.replace(',', '').trim())) * 100).toFixed(1);
  }

  const fetchTableStatsData = () => {
    async function send() {
      // setIsDataLoading(true);
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const { data: results } = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/usgs/tablestats-data/`,
          {
            properties: {
              year: waterYear.wateryear,
              endMonth: endMonth.watermonth,
            },
          },
          { headers }
        );

        const allTableStatsDataCsvString = [
          [
            'Name',
            'USGS Gauge',
            'Selected Water Year Statistics',
            'Cumulative Flows (AF)',
            'Percent of Median',
            'Start of Record',
            'End of Record',
            'Driest Year on Record',
            'Driest % of Median',
            [`"Driest Flows, Oct - ${endMonth.month_abbrev} (AF)"`],
            'Wettest Year on Record',
            'Wettest % of Median',
            [`"Wettest Flows, Oct - ${endMonth.month_abbrev} (AF)"`],
            [`"Median Flows, Oct - ${endMonth.month_abbrev} (AF)"`],
            'For More Info',
          ],
          ...results.map(item => [
            '"' + item.station_desc + '"',
            '"' + item.usgs_site_no + '"',
            `"Oct - ${endMonth.month_abbrev} ${waterYear.wateryear}"`,
            '"' + item.cumulative_af + '"',
            '"' + item.pct_of_normal + '"',
            '"' + tableStatsInfo[item.station_ndx].porminyear + '"',
            '"' + tableStatsInfo[item.station_ndx].pormaxyear + '"',
            '"' + tableStatsInfo[item.station_ndx].lowest_year + '"',
            '"' + convertToPercent(item.lowest_year_cumulative_af, item.median_year_cumulative_af) + '%"',
            '"' + item.lowest_year_cumulative_af + '"',
            '"' + tableStatsInfo[item.station_ndx].highest_year + '"',
            '"' + convertToPercent(item.highest_year_cumulative_af, item.median_year_cumulative_af) + '%"',
            '"' + item.highest_year_cumulative_af + '"',
            '"' + item.median_year_cumulative_af + '"',
            `"https://waterdata.usgs.gov/nwis/inventory?agency_code=USGS&site_no=${item.usgs_site_no}"`,
          ]),
        ]
          .map(e => e.join(','))
          .join('\n');

        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURIComponent(allTableStatsDataCsvString);
        a.target = '_blank';
        a.download = `Hydrograph Statistics - All Gauges - Oct-${endMonth.month_abbrev} ${waterYear.wateryear}.csv`;
        document.body.appendChild(a);
        a.click();
      } catch (err) {
        console.error(err);
      }
    }
    send();
  };

  const handleExportClick = () => {
    fetchTableStatsData();
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

          <Link
            component={RouterLink}
            to="/resources-links/help"
            target="_blank"
            className={(classes.menuItem, classes.link)}
          >
            Help
          </Link>

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
          <Flex justifyContent={'start'}>
            <Button
              disabled={!tableStatsInfo}
              color="secondary"
              variant="outlined"
              disableElevation
              onClick={handleExportClick}
              startIcon={<DownloadIcon />}
              style={{
                marginLeft: theme.spacing(1),
              }}
            >
              Export All Gauge Statistics
            </Button>
          </Flex>
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
