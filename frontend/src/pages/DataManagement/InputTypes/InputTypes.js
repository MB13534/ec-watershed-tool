import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import useFetchData from "../../../hooks/useFetchData";
import Layout from "../../../components/Layout";
import SecondaryNav from "../../../components/SecondaryNav";
import DataAdminTable from "../../../components/DataAdminTable/DataAdminTable";
import { MenuItems } from "../MenuItems";

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

const InputTypes = (props) => {
  const classes = useStyles();
  const [Data, isLoading, setData] = useFetchData("list-input-types", []);

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
              title="Input Types"
              data={Data}
              columns={[
                {
                  title: "Input Type Index",
                  field: "input_type_ndx",
                  editable: 'never',
                },
                {
                  title: "Input Type Description",
                  field: "input_type_desc",
                },
                {
                  title: "Input Type Label",
                  field: "input_type_label",
                },
                {
                  title: "Default Weighting Factor",
                  field: "default_weighting_factor",
                },
                {
                  title: "UI Sort",
                  field: "ui_sort",
                },
              ]}
              editable={{
              }}
              loading={isLoading}
              updateHandler={setData}
              endpoint="list-input-types"
              ndxField="input_type_ndx"
            />
          </Container>
        </div>
      </section>
    </Layout>
  );
};

export default InputTypes;
