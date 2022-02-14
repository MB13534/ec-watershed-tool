import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { Typography, Container, Box } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Layout from '../../components/Layout';
import LinkIcon from '@material-ui/icons/Link';
import { useAuth0 } from '../../hooks/useAuth0';
import DataStudioEmbed from '../../components/DataStudioEmbed/DataStudioEmbed';

// create page styles
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(8),
  },
  description: {
    marginTop: 0,
    marginBottom: theme.spacing(2),
    lineHeight: 1.8,
    fontSize: 18,
    textAlign: 'left',
  },
}));

const ResourcesAndLinks = props => {
  const classes = useStyles();
  let history = useHistory();
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  // Configure sidebar menu items
  const LinkItems = [
    {
      link: 'resources-links/benchmarks',
      title: 'Water Quality Benchmarks & Rationale',
      exact: true,
      rolesRequired: false,
      icon: LinkIcon,
      loginRequired: true,
    },
    {
      link: 'resources-links/map-layer-documentation',
      title: 'Map Layer Documentation',
      exact: true,
      rolesRequired: false,
      icon: LinkIcon,
      loginRequired: true,
    },
    {
      link: 'resources-links/help',
      title: 'Watershed Tool Quickstart Guide',
      exact: true,
      rolesRequired: false,
      icon: LinkIcon,
      loginRequired: true,
    },
  ];

  const returnLinkItem = (item, isAuthenticated, user) => {
    const li = (
      <ListItem button>
        <ListItemIcon className={classes.navIcon} onClick={() => goTo(item.link)}>
          <item.icon />
        </ListItemIcon>
        <ListItemText className={classes.navText} primary={item.title} onClick={() => goTo(item.link)} />
      </ListItem>
    );
    return li;
  };

  // function for naviating to a specific page in the app
  const goTo = route => {
    history.push(`/${route}`);
    localStorage.setItem('last_url', history.location.pathname);
  };

  return (
    <Layout>
      <Container maxWidth="md" className={classes.container}>
        <Typography variant="h4" gutterBottom>
          Resources & Links
        </Typography>
        {/* <Typography variant="body1" className={classes.description} paragraph>
          This will be a list of external links and resources
        </Typography> */}
        <List className={classes.nav}>{LinkItems.map(item => returnLinkItem(item, isAuthenticated, user))}</List>
      </Container>
    </Layout>
  );
};

export default ResourcesAndLinks;
