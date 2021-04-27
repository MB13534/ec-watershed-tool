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
  { id: 1, title: "Contacts", path: "/data-management/contacts" },
];

const ContactGroups = (props) => {
  const classes = useStyles();
  const [Data, isLoading, setData] = useFetchData("example/contact-groups", []);

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
              title="Contact Groups Management"
              data={Data}
              columns={[{ title: "Group Name", field: "group_name" }]}
              loading={isLoading}
              updateHandler={setData}
              endpoint="example/contact-groups"
              ndxField="group_ndx"
            />
          </Container>
        </div>
      </section>
    </Layout>
  );
};

export default ContactGroups;
