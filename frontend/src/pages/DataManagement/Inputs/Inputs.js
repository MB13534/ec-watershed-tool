import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import useFetchData from "../../../hooks/useFetchData";
import Layout from "../../../components/Layout";
import SecondaryNav from "../../../components/SecondaryNav";
import DataAdminTable from "../../../components/DataAdminTable/DataAdminTable";
import { MenuItems } from "../MenuItems";
import { useAuth0 } from '../../../hooks/useAuth0';

// create page styles
const useStyles = makeStyles((theme) => ({
  content: {
    marginTop: theme.spacing(2),
  },
  container: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  topNav: {
    marginBottom: theme.spacing(2),
  },
}));

const Inputs = (props) => {
  const classes = useStyles();
  const { user } = useAuth0();
  const [Data, isLoading, setData] = useFetchData("list-inputs", []);
  const [TypeData, isTypeLoading] = useFetchData("list-input-types/all", []);
  const [ValueTypeData, isValueTypeLoading] = useFetchData("list-input-value-types", []);

  let canEdit = false;
  const rolesThatCanEdit = ['Admin', 'Owner', 'Modeling Admin'];
  rolesThatCanEdit.forEach((role) => {
    if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
      canEdit = true;
    }
  });

  let canAdd = false;
  const rolesThatCanAdd = ['Admin', 'Owner', 'Modeling Admin'];
  rolesThatCanAdd.forEach((role) => {
    if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
      canAdd = true;
    }
  });

  let canDelete = false;
  const rolesThatCanDelete = ['Admin', 'Owner', 'Modeling Admin'];
  rolesThatCanDelete.forEach((role) => {
    if (user[`${process.env.REACT_APP_AUDIENCE}/roles`].includes(role)) {
      canDelete = true;
    }
  });

  return (
    <Layout>
      <section className={classes.root}>
        <div className={classes.content}>
          <Container maxWidth="lg" className={classes.container}>
            <SecondaryNav
              title="Database Management"
              menuItems={MenuItems}
              className={classes.topNav}
            />
            <DataAdminTable
              title="Best Management Practices"
              data={Data}
              canEdit={canEdit}
              canAdd={canAdd}
              canDelete={canDelete}
              columns={[
                {
                  title: "Practice Type",
                  field: "input_type_ndx",
                  editable: 'onAdd',
                  lookup: Object.fromEntries(TypeData.map((row) => [row.input_type_ndx, row.input_type_label])),
                  render: (rowData) => {
                    if (!rowData) return '';
                    if (TypeData.length === 0) return 'Loading...';
                    return TypeData.find(x => x.input_type_ndx === rowData.input_type_ndx).input_type_label;
                  }
                },
                {
                  title: "BMP Description",
                  field: "input_desc",
                },
                {
                  title: "Scoring Type",
                  field: "value_type_ndx",
                  lookup: Object.fromEntries(ValueTypeData.map((row) => [row.value_type_ndx, row.value_type_desc])),

                },
                { title: "Score Value", field: "input_value" },
              ]}
              loading={isLoading || isTypeLoading || isValueTypeLoading}
              updateHandler={setData}
              endpoint="list-inputs"
              ndxField="input_ndx"
            />
          </Container>
        </div>
      </section>
    </Layout>
  );
};

export default Inputs;
