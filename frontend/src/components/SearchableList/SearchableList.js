import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SortIcon from "@material-ui/icons/SortByAlpha";
import UpIcon from "@material-ui/icons/ArrowDropUp";
import DownIcon from "@material-ui/icons/ArrowDropDown";
import { Flex } from "../Flex";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: 35,
    height: 35,
    fontSize: 15,
  },
  formControl: {
    margin: theme.spacing(1),
  },
  search: {
    width: 300,
  },
  list: {
    overflowY: "scroll",
    maxHeight: 600,
  },
}));

const SearchableList = ({
  data = [],
  valueField,
  displayField,
  title,
  active = {},
  onClick = () => {},
}) => {
  const classes = useStyles();
  const [searchText, setSearchText] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  if (data.length === 0) {
    return (
      <Box marginTop={2}>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">No Data Found</Typography>
      </Box>
    );
  }

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchText(value);
  };

  const handleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <Box marginTop={2} width="100%">
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Flex>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel htmlFor="search">Search</InputLabel>
          <OutlinedInput
            id="search"
            value={searchText}
            onChange={handleSearch}
            label="Search"
            className={classes.search}
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="search">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <Flex justifyContent="start">
          <IconButton onClick={handleSortDirection}>
            <SortIcon color="primary" size="large" />
          </IconButton>
          {sortDirection === "asc" ? (
            <UpIcon size="small" color="disabled" />
          ) : (
            <DownIcon size="small" color="disabled" />
          )}
        </Flex>
      </Flex>

      <List className={classes.list}>
        {data
          .filter((record) =>
            record[displayField].toLowerCase().includes(searchText)
          )
          .sort((a, b) => {
            if (sortDirection === "asc") {
              if (a[displayField] < b[displayField]) {
                return -1;
              }
              if (a[displayField] > b[displayField]) {
                return 1;
              }
              return 0;
            } else {
              if (a[displayField] > b[displayField]) {
                return -1;
              }
              if (a[displayField] < b[displayField]) {
                return 1;
              }
              return 0;
            }
          })
          .map((record) => (
            <ListItem
              key={record[displayField]}
              button
              selected={record[displayField] === active[displayField]}
              onClick={() => onClick(record)}
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  {record[displayField].charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={record[displayField]} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
};

SearchableList.propTypes = {
  /**
   * Title to display above the list
   */
  title: PropTypes.string,
  /**
   * Data to display in a searchable list.
   * Expects an array of objects.
   */
  data: PropTypes.array.isRequired,
  /**
   * Name of the field that contains the internal value
   * i.e. the index field in a list table
   */
  valueField: PropTypes.string.isRequired,
  /**
   * Name of the field that contains the display value
   * i.e. the description field in a list table
   */
  displayField: PropTypes.string.isRequired,
  /**
   * Object representing the currently selected list value
   */
  active: PropTypes.object,
  /**
   * Event handler for when the user selects a list item
   */
  onClick: PropTypes.func,
};

export default SearchableList;
