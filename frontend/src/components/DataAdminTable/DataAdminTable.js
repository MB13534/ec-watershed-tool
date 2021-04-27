import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Paper, makeStyles } from "@material-ui/core";
import CopyIcon from "@material-ui/icons/FileCopy";
import MaterialTable, { MTableBodyRow } from "material-table";
import { useAuth0 } from "../../hooks/useAuth0";
import useFormSubmitStatus from "../../hooks/useFormSubmitStatus";
import FormSnackbar from "../FormSnackbar";
import useVisibility from "../../hooks/useVisibility";
import { copyToClipboard } from "../../utils";

const useStyles = makeStyles((theme) => ({
  table: {
    "& th": {
      paddingLeft: theme.spacing(2),
    },
    "& td": {
      paddingLeft: `${theme.spacing(2)}px!important`,
    },
  },
}));

/**
 * This component is used has a shortcut for creating a data management
 * table using the Material Table library.
 * For more information on the Material Table library, please visit
 * https://material-table.com/#/
 */
const DataAdminTable = ({
  title,
  data,
  columns,
  loading,
  updateHandler,
  endpoint,
  ndxField,
  options = {},
  components = {},
  actions = [],
  handleRefresh = () => {},
  canEdit = true,
  canAdd = false,
  canDelete = false,
}) => {
  const classes = useStyles();
  const [copySnackbarOpen, handleCopySnackbarOpen] = useVisibility(false);
  const {
    setWaitingState,
    snackbarOpen,
    snackbarError,
    handleSnackbarClose,
  } = useFormSubmitStatus();
  const { getTokenSilently } = useAuth0();
  const [selectedRow, setSelectedRow] = useState(null);

  /**
   * Utility function used to set the exported CSV files name
   * using the table title
   * Strips out spaces and replaces with "_" and makes
   * file name lower case
   * @param {string} title
   */
  const setFileName = (title = "") => {
    return title.toLowerCase().replace(/ /gi, "_");
  };

  /**
   * Event handler for when the user adds and saves a new record
   * @param {object} newData
   */
  const handleAdd = (newData) => {
    return (async () => {
      setWaitingState("in progress");
      try {
        const token = await getTokenSilently();
        const headers = { Authorization: `Bearer ${token}` };
        const addedRec = await axios.post(
          `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}`,
          newData,
          { headers }
        );
        updateHandler((prevState) => {
          let data = [...prevState];
          data.push(addedRec.data);
          return data;
        });
        handleRefresh();
        setWaitingState("complete", "no error");
      } catch (err) {
        console.error(err);
        setWaitingState("complete", "error");
      }
    })();
  };

  /**
   * Event handler for when the user edits existing data
   * @param {object} newData
   * @param {object} oldData
   */
  const handleUpdate = (newData, oldData) => {
    return (async () => {
      setWaitingState("in progress");
      try {
        if (oldData) {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.put(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${newData[ndxField]}`,
            newData,
            { headers }
          );
          updateHandler((prevState) => {
            const data = [...prevState];
            data[data.indexOf(oldData)] = newData;
            return data;
          });
          handleRefresh();
          setWaitingState("complete", "no error");
        } else {
          setWaitingState("complete", "error");
        }
      } catch (err) {
        console.error(err);
        setWaitingState("complete", "error");
      }
    })();
  };

  const handleDelete = (record) => {
    return (async () => {
      setWaitingState("in progress");
      try {
        if (record) {
          const token = await getTokenSilently();
          const headers = { Authorization: `Bearer ${token}` };
          await axios.delete(
            `${process.env.REACT_APP_ENDPOINT}/api/${endpoint}/${record[ndxField]}`,
            { headers }
          );
          updateHandler((prevState) => {
            const data = [...prevState];
            data.splice(data.indexOf(record), 1);
            return data;
          });
          handleRefresh();
          setWaitingState("complete", "no error");
        } else {
          setWaitingState("complete", "error");
        }
      } catch (err) {
        console.error(err);
        setWaitingState("complete", "error");
      }
    })();
  }

  let editable = {};

  if (canEdit) {
    editable.onRowUpdate = handleUpdate;
  }
  if (canAdd) {
    editable.onRowAdd = handleAdd;
  }
  if (canDelete) {
    editable.onRowDelete = handleDelete;
  }

  return (
    <div className={classes.table}>
      <MaterialTable
        data={data}
        columns={columns}
        title={title}
        isLoading={loading}
        onRowClick={(evt, selectedRow) => {
          setSelectedRow(selectedRow);
        }}
        editable={editable}
        components={{
          Row: (props) => <MTableBodyRow {...props} />,
          Container: (props) => <Paper variant="outlined" {...props}></Paper>,
          ...components,
        }}
        options={{
          emptyRowsWhenPaging: false,
          columnsButton: true,
          exportButton: true,
          exportAllData: true,
          exportFileName: setFileName(title),
          addRowPosition: "first",
          actionsCellStyle: { justifyContent: "center" },
          actionsColumnIndex: 0,
          pageSize: options.pageSize || 30,
          pageSizeOptions: options.pageSizeOptions || [15, 30, 45],
          maxBodyHeight: data.length < 20 ? 525 : 625,
          padding: "dense",
          ...options,
          rowStyle: (rowData) => ({
            backgroundColor:
              selectedRow && selectedRow.tableData.id === rowData.tableData.id
                ? "#EEE"
                : "#FFF",
          }),
        }}
        actions={[
          {
            icon: CopyIcon,
            tooltip: "Copy Data",
            isFreeAction: true,
            onClick: (event) => {
              copyToClipboard(data, columns, () =>
                handleCopySnackbarOpen(true)
              );
            },
          },
          ...actions,
        ]}
      />
      <FormSnackbar
        open={snackbarOpen}
        error={snackbarError}
        handleClose={handleSnackbarClose}
        successMessage="Success"
        errorMessage="Error"
      />
      <FormSnackbar
        open={copySnackbarOpen}
        error={false}
        handleClose={() => handleCopySnackbarOpen(false)}
        successMessage="Copied to Clipboard"
      />
    </div>
  );
};

DataAdminTable.propTypes = {
  /**
   * Data to display in the table.
   * An array of objects
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * An array of objects representing the column
   * configuration for the table
   * [{ title: "Structure Name", field: "structure_name" }]
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    })
  ),
  /**
   * Custom component overrides for the Material Table
   * Find more info at https://material-table.com/#/docs/features/component-overriding
   */
  components: PropTypes.object,
  /**
   * Root endpoint for the API routes related to the table
   * i.e. "structures"
   */
  endpoint: PropTypes.string,
  /**
   * Name of the table field that contains the key index values
   * for the table.
   * i.e. "structure_ndx"
   */
  ndxField: PropTypes.string,
  /**
   * Loading state for the table
   */
  loading: PropTypes.bool,
  /**
   * Title to be displayed above the table
   */
  title: PropTypes.string,
  /**
   * Function that will run whenever a table row is
   * added or modified
   */
  updateHandler: PropTypes.func,
  /**
   * Configuration options for the material table
   * All options can be found at https://material-table.com/#/docs/all-props
   */
  options: PropTypes.object,
  /**
   * An array of action configurations (i.e. add, edit) for
   * the material table
   * More info can be found at https://material-table.com/#/docs/features/actions
   */
  actions: PropTypes.array,
  /**
   * Function that runs whenever a table row is added or modified
   * Handler used to tell the parent component that data should
   * be refreshed
   */
  handleRefresh: PropTypes.func,
};

export default DataAdminTable;
