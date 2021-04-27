import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Grid, Box, Chip } from "@material-ui/core";
import Layout from "../../../components/Layout";
import { useAuth0 } from "../../../hooks/useAuth0";
import useFetchData from "../../../hooks/useFetchData";
import useFormSubmitStatus from "../../../hooks/useFormSubmitStatus";
import NoSelectionsIllustrations from "../../../images/undraw_setup_wizard_r6mr.svg";
import { Flex } from "../../../components/Flex";
import AssociationControls from "./AssociationControls";
import FormSnackbar from "../../../components/FormSnackbar";
import SearchableList from "../../../components/SearchableList";
import GroupAssociations from "./GroupAssociations";
import ChipNav from "../../../components/ChipNav";
import InfoCard from "../../../components/InfoCard";
import SecondaryNav from "../../../components/SecondaryNav";
import { MenuItems } from "../MenuItems";

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
  colLeft: {
    // borderRight: "1px solid #dddddd",
  },
}));

const ContactsToGroups = (props) => {
  const classes = useStyles();
  const [refreshSwitch, setRefreshSwitch] = useState(false);
  const { getTokenSilently } = useAuth0();
  const [Contacts] = useFetchData(`example/contacts`, [refreshSwitch]);
  const [ContactGroups] = useFetchData(`example/contact-groups`, []);
  const [
    associatedGroups,
  ] = useFetchData(`example/contacts/assoc/contact-groups`, [refreshSwitch]);
  const [activeContact, setActiveContact] = useState({});
  const [activeAssociations, setActiveAssociations] = useState([]);
  const {
    setWaitingState,
    snackbarOpen,
    snackbarError,
    handleSnackbarClose,
  } = useFormSubmitStatus();

  /**
   * Logic used to pre-populate the structure association checkboxes
   * with the existing associations for the active user
   * Logic runs whenever the associations data updates or whenever
   * the active user changes
   */
  useEffect(() => {
    const activeAssoc = associatedGroups.filter(
      (d) => activeContact.contact_ndx === d.contact_ndx
    );

    if (activeAssoc.length > 0 && activeAssoc[0].group_ndx !== null) {
      setActiveAssociations(activeAssoc.map((d) => d.group_ndx));
    } else {
      setActiveAssociations([]);
    }
  }, [Contacts, activeContact, associatedGroups]);

  const handleRefresh = () => {
    setRefreshSwitch((state) => !state);
  };

  /**
   * Event handler for selecting a contact from the contacts list
   * @param {object} contact selected contact
   */
  const handleContactSelect = (contact) => {
    setActiveAssociations([]);
    setActiveContact(contact);
  };

  /**
   * Event handler for when the user checks a structure on/off
   * from the structure associations component
   * @param {*} event
   */
  const handleGroupSelect = (event) => {
    const { value, checked } = event.target;
    setActiveAssociations((prevState) => {
      let newValues = [...prevState];
      if (checked) {
        newValues.push(+value);
      } else {
        const index = newValues.indexOf(+value);
        newValues.splice(index, 1);
      }
      return newValues;
    });
  };

  /**
   * Event handle for de-selecting all structures
   */
  const handleSelectNone = () => setActiveAssociations([]);

  /**
   * Event handler for selecting all structures
   */
  const handleSelectAll = () =>
    setActiveAssociations(ContactGroups.map((d) => d.group_ndx));

  /**
   * Utility function used to merge the active user
   * with the associated structures
   * Used to prep the data and return an object in the required
   * format for the API to update/insert associations
   */
  const prepareValues = () => {
    return activeAssociations.map((assoc) => ({
      contact_ndx: activeContact.contact_ndx,
      group_ndx: assoc,
    }));
  };

  /**
   * Event handler for saving user/structure associations
   * to the database
   */
  const handleSubmit = () => {
    // Set up a cancellation source
    let didCancel = false;
    setWaitingState("in progress");
    async function writeData() {
      try {
        const token = await getTokenSilently();
        // Create request headers with token authorization
        const headers = { Authorization: `Bearer ${token}` };
        await axios.post(
          // TODO REPLACE WITH REAL ENDPOINT AND LOGIC
          `${process.env.REACT_APP_ENDPOINT}/api/example/contacts/${activeContact.contact_ndx}/assoc/contact-groups`,
          prepareValues(),
          { headers }
        );
        if (!didCancel) {
          // Ignore if we started fetching something else
          console.log("success");
          setWaitingState("complete", "no error");
          handleRefresh();
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
          setWaitingState("complete", "error");
        }
        didCancel = true;
      }
    }
    writeData();
    // return () => { didCancel = true; }; // Remember if we start fetching something else
  };

  /**
   * Menu items for the top navigation bar
   */
  const RelatedTablesLinks = [
    {
      id: 1,
      title: "Contacts",
      path: "/contacts",
    },
    {
      id: 2,
      title: "Contact Groups",
      path: "/contact-groups",
    },
  ];

  return (
    <Layout>
      <section className={classes.root}>
        <div className={classes.content}>
          <Container maxWidth="lg" className={classes.root}>
            <SecondaryNav
              title="Database Management"
              menuItems={MenuItems}
              className={classes.topNav}
            />
            <Box marginLeft={3} marginTop={3} marginBottom={2}>
              <ChipNav title="Related Tables" menuItems={RelatedTablesLinks} />
            </Box>
            <Typography variant="h6" gutterBottom style={{ marginLeft: 24 }}>
              Contacts to Contact Groups Management
            </Typography>
            <InfoCard ml={3} mr={3}>
              <Typography variant="body1">
                This interface can be used to manage Contact to Contact Group
                associations. To manage Contact Group to Contact associations,
                please use the related tables link at the top of this page.
              </Typography>
            </InfoCard>
            <Grid container spacing={4} style={{ paddingLeft: 24 }}>
              <Grid item xs={12} sm={5} className={classes.colLeft}>
                <SearchableList
                  data={Contacts}
                  valueField="contact_ndx"
                  displayField="contact_name"
                  active={activeContact}
                  onClick={handleContactSelect}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <Box marginTop={2} width="100%">
                  <Flex>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Manage Contact Group Associations:
                    </Typography>

                    {activeContact.contact_name && (
                      <Box marginTop={2} marginBottom={2} marginLeft={2}>
                        <Chip label={activeContact.contact_name} />
                      </Box>
                    )}
                  </Flex>

                  {activeContact.contact_name && (
                    <AssociationControls
                      handleSave={handleSubmit}
                      handleSelectAll={handleSelectAll}
                      handleSelectNone={handleSelectNone}
                    />
                  )}

                  {activeContact.contact_name ? (
                    <GroupAssociations
                      title="Groups"
                      data={ContactGroups}
                      defaultVisibility={true}
                      selections={activeAssociations}
                      onCheck={handleGroupSelect}
                    />
                  ) : (
                    <>
                      <Typography variant="body1" paragraph>
                        Please select a contact from the Contacts List to
                        associate them with Contact Groups.
                      </Typography>
                      <Box
                        maxWidth={300}
                        marginLeft="auto"
                        marginRight="auto"
                        marginTop={4}
                      >
                        <img
                          src={NoSelectionsIllustrations}
                          alt="No Selections"
                          style={{ maxWidth: "100%" }}
                        />
                      </Box>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Container>
          <FormSnackbar
            open={snackbarOpen}
            error={snackbarError}
            handleClose={handleSnackbarClose}
            successMessage="Associations successfully saved."
            errorMessage="Associations could not be saved."
          />
        </div>
      </section>
    </Layout>
  );
};

export default ContactsToGroups;
