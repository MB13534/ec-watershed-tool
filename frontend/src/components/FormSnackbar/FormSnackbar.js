import React from "react";
import PropTypes from "prop-types";
import { Snackbar, SnackbarContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  snackbarSuccess: {
    backgroundColor: "#4074DC",
  },
  snackbarError: {
    backgroundColor: "#e94a4a",
  },
}));

/**
 * This component used to render a success or error message
 * using a Material UI Snackbar. Common use cases are to display
 * the component on a form submit, copy to clipboard action or
 * any other sort of data operation.
 */
const FormSnackbar = ({
  open,
  error,
  errorMessage = "There was an error saving the data.",
  successMessage = "Data successfully saved!",
  handleClose,
}) => {
  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <SnackbarContent
        className={error ? classes.snackbarError : classes.snackbarSuccess}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar">
            {error ? errorMessage : successMessage}
          </span>
        }
      />
    </Snackbar>
  );
};

FormSnackbar.propTypes = {
  /**
   * Boolean used to control whether the snackbar is visible
   * or hidden
   */
  open: PropTypes.bool.isRequired,
  /**
   * Boolean indicating whether an error state snackbar should be
   * shown
   */
  error: PropTypes.bool.isRequired,
  /**
   * Optional message for the error state. Defaults to "There was
   * asn error saving the data."
   */
  errorMessage: PropTypes.string,
  /**
   * Optional message for the success state. Defaults to "Data successfully saved!"
   */
  successMessage: PropTypes.string,
  /**
   * Function used to update snackbar open state and handle the close
   * event
   */
  handleClose: PropTypes.func.isRequired,
};

export default FormSnackbar;
