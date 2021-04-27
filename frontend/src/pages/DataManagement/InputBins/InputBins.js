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

const InputBins = (props) => {
  const classes = useStyles();
  const [Data, isLoading, setData] = useFetchData("list-input-bins", []);
  const [TypeData, isTypeLoading] = useFetchData("list-input-types/all", []);

  return (
    <Layout>
      <section className={classes.root}>
        <div className={classes.content}>
          <Container maxWidth="lg" className={classes.container}>
            <SecondaryNav
              title="Database Managements"
              menuItems={MenuItems}
              className={classes.topNav}
            />
            <DataAdminTable
              title="Input Bins"
              data={Data}
              columns={[
                {
                  title: "Input Type",
                  field: "input_type_ndx",
                  editable: false,
                  render: (rowData) => {
                    if (TypeData.length === 0) return 'Loading...';
                    return TypeData.find(x => x.input_type_ndx === rowData.input_type_ndx).input_type_label;
                  }
                },
                {
                  title: "Bin Description",
                  field: "bin_description",
                },
                {
                  title: "Bin Low Value",
                  field: "bin_low_val",
                },
                {
                  title: "Bin High Value",
                  field: "bin_high_val",
                },
                {
                  title: "Bin Score",
                  field: "bin_score",
                },
              ]}
              loading={isLoading || isTypeLoading}
              updateHandler={setData}
              endpoint="list-input-bins"
              ndxField="bin_ndx"
            />
          </Container>
        </div>
      </section>
    </Layout>
  );
};

export default InputBins;
