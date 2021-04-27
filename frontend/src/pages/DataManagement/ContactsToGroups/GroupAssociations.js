import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Divider,
  Button,
  Collapse,
} from "@material-ui/core";
import useVisibility from "../../../hooks/useVisibility";

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(2),
  },
  btn: {
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1),
  },
}));

const GroupAssociations = ({
  title,
  data,
  defaultVisibility,
  selections,
  onCheck,
}) => {
  const classes = useStyles();
  const [visibility, setVisibility] = useVisibility(defaultVisibility);

  return (
    <Box marginTop={1} marginBottom={2}>
      <Typography variant="h6" color="primary" display="inline" gutterBottom>
        {title}
      </Typography>
      <Button size="small" className={classes.btn} onClick={setVisibility}>
        {visibility ? "Hide" : "Show"}
      </Button>

      <Collapse in={visibility}>
        <FormGroup row>
          {data.map((d) => (
            <FormControlLabel
              key={d.group_ndx}
              control={
                <Checkbox
                  color="secondary"
                  checked={selections.includes(d.group_ndx)}
                  onChange={onCheck}
                  name={d.contact_name}
                  value={d.group_ndx}
                />
              }
              label={d.group_name}
            />
          ))}
        </FormGroup>
      </Collapse>
      <Divider className={classes.divider} />
    </Box>
  );
};

GroupAssociations.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  defaultVisibility: PropTypes.bool,
  selections: PropTypes.array.isRequired,
  onCheck: PropTypes.func.isRequired,
};

export default GroupAssociations;
