import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  AppBar,
  Toolbar,
  Divider,
  Link,
  Menu,
  MenuItem,
} from "@material-ui/core";
import DropdownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Flex } from "../Flex";
import { useAuth0 } from '../../hooks/useAuth0';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  activeLink: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: 17,
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: `#e9e9e9`,
      textDecoration: `none`,
    },
  },
  link: {
    fontSize: 17,
    color: "#777777",
    margin: theme.spacing(0.5),
    padding: theme.spacing(1),
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: "#e9e9e9",
      textDecoration: `none`,
    },
  },
  activeChildLink: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    fontSize: 17,
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: `#e9e9e9`,
      textDecoration: `none`,
    },
  },
  childLink: {
    fontSize: 17,
    color: "#777777",
    borderRadius: 4,
    textDecoration: `none`,
    "&:hover": {
      backgroundColor: "#e9e9e9",
      textDecoration: `none`,
    },
  },
  dropdownIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const SecondaryNav = ({ title, menuItems, ...other }) => {
  const classes = useStyles();
  let history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * utility function used to check
   * if a menu item is active or not
   * @param {*} url
   */
  const checkActive = (history, url, exact) => {
    if (exact) {
      if (history.location.pathname === url) {
        return true;
      }
      return false;
    } else {
      if (history.location.pathname.includes(url)) {
        return true;
      }
      return false;
    }
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

  /**
   * Assign appropriate class name to menu item based
   * on if menu item is active or not
   * @param {*} url
   */
  const handleActiveChild = (url, exact) => {
    const active = checkActive(history, url, exact);
    if (active) {
      return classes.activeChildLink;
    }
    return classes.childLink;
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      className={classes.root}
      elevation={0}
      {...other}
    >
      <Toolbar>
        {title && (
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        )}
        {menuItems.map((item) => {
          if (item.children && item.children.length > 0) {
            return (
              <React.Fragment key={item.title}>
                <Link
                  key={item.id}
                  onClick={handleClick}
                  className={handleActive(item.activePath, item.exact)}
                >
                  <Flex>
                    {item.title}
                    <DropdownIcon style={{ marginLeft: 4 }} />
                  </Flex>
                </Link>
                <Menu
                  id={item.title}
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      component={RouterLink}
                      to={child.path}
                      className={handleActiveChild(
                        child.activePath,
                        child.exact
                      )}
                      onClick={handleClose}
                    >
                      <MenuItem>{child.title}</MenuItem>
                    </Link>
                  ))}
                </Menu>
              </React.Fragment>
            );
          } else {
            let list = (
              <Link
                key={item.id}
                component={RouterLink}
                to={item.path}
                className={handleActive(item.activePath, item.exact)}
              >
                {item.title}
              </Link>
            );

            if (item.rolesRequired && user) {
              let roleSwitch = false;
              const roles = [...item.rolesRequired];
              roles.forEach((role) => {
                if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
                  roleSwitch = true;
                }
              });
              if (isAuthenticated && roleSwitch) {
                return list;
              }
            } else {
              return list;
            }
          }
          return null;
        })}
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

SecondaryNav.propTypes = {
  /**
   * The site title to be displayed in the navigation bar.
   */
  title: PropTypes.string,
  /**
   * An array of navigation menu items
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      activePath: PropTypes.string.isRequired,
      exact: PropTypes.boolean,
      children: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          title: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
          exact: PropTypes.boolean,
        })
      ),
    })
  ).isRequired,
};

export default SecondaryNav;
