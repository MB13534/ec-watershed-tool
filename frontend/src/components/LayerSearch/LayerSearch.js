import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    margin: theme.spacing(1),
    backgroundColor: "#ffffff",
    width: (props) => props.width,
  },
}));

const LayerSearch = ({ width = 400, value = "", handleSearch }) => {
  const classes = useStyles({ width });
  return (
    <TextField
      label="Layer Search"
      id="layer-search"
      className={classes.textField}
      size="small"
      value={value}
      onChange={handleSearch}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Search Icon"
              edge="end"
              onClick={() => {
                if (value !== "") {
                  handleSearch({ target: { value: "" } });
                } else {
                  return;
                }
              }}
            >
              {value !== "" ? <ClearIcon /> : <SearchIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};

export default LayerSearch;
