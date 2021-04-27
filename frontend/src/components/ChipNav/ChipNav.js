import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Link } from "@material-ui/core";
import { Flex } from "../Flex";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(0, 2, 1, 0),
  },
  chip: {
    cursor: "pointer",
    margin: theme.spacing(0, 1, 1, 0),
  },
}));

const ChipNav = ({ title, menuItems, ...other }) => {
  const classes = useStyles();
  return (
    <Flex alignItems="center">
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
      {menuItems.map((item) => (
        <Link key={item.id} component={RouterLink} to={item.path}>
          <Chip label={item.title} color="primary" className={classes.chip} />
        </Link>
      ))}
    </Flex>
  );
};

ChipNav.propTypes = {
  /**
   * The site title to be displayed in the chip navigation bar.
   */
  title: PropTypes.string.isRequired,
  /**
   * An array of menu items
   */
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ChipNav;
