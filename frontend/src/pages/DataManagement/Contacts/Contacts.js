import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Box } from "@material-ui/core";
import useFetchData from "../../../hooks/useFetchData";
import Layout from "../../../components/Layout";
import SecondaryNav from "../../../components/SecondaryNav";
import ChipNav from "../../../components/ChipNav";
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

const RelatedTablesLinks = [
  { id: 1, title: "Orders", path: "/data-management/orders" },
];

const Contacts = (props) => {
  const classes = useStyles();
  const [Data, isLoading, setData] = useFetchData("example/contacts", []);

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
            <Box marginLeft={3} marginTop={3} marginBottom={2}>
              <ChipNav title="Related Tables" menuItems={RelatedTablesLinks} />
            </Box>
            <DataAdminTable
              title="Contacts Management"
              data={Data}
              columns={[
                { title: "Name", field: "contact_name" },
                { title: "Phone", field: "phone" },
                { title: "Address", field: "address" },
                { title: "City", field: "city" },
                { title: "State", field: "state" },
              ]}
              loading={isLoading}
              updateHandler={setData}
              endpoint="example/contacts"
              ndxField="contact_ndx"
            />
          </Container>
        </div>
      </section>
    </Layout>
  );
};

export default Contacts;
