import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Accordion as MaterialAccordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import slugify from 'slugify';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    display: 'block',
    // backgroundColor: '#f7f7f7',
  },
}));

/**
 * Utility for converting the accordion title into a slug
 * that can then be used for the various accessibility props
 * @param {string} text
 * @returns string
 */
const createSlug = text => {
  return slugify(text, {
    replacement: '-',
    lower: true,
  });
};

/**
 * Utility component used to abstract away and standardize some of the logic
 * and UI for each collapsible section of the Mobile Stations Report
 */
const Accordion = ({ title, content, ...rest }) => {
  const [panelName, setPanelName] = useState(createSlug(title));
  const classes = useStyles();

  useEffect(() => {
    setPanelName(createSlug(title));
  }, [title]);

  return (
    <MaterialAccordion {...rest}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelName}-content`}
        id={`${panelName}-header`}
      >
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>{content}</AccordionDetails>
    </MaterialAccordion>
  );
};

Accordion.propTypes = {
  title: PropTypes.string,
  content: PropTypes.element,
};

export default Accordion;
