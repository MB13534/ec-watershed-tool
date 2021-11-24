import { lighten } from '@material-ui/core/styles';
import copy from 'copy-to-clipboard';
import Papa from 'papaparse';
import moment from 'moment';

/**
 * utility function used to check
 * if a menu item is active or not
 * @param {*} url
 */
export const checkActive = (history, url, exact = false) => {
  if (exact) {
    return history.location.pathname === `/${url}`;
  } else {
    return history.location.pathname.includes(url);
  }
};

/**
 * Utility function used to implement
 * copy to clipboard functionality
 * @param {array} data
 * @param {array} columns
 * @param {function} callback
 */
export const copyToClipboard = (data, columns, callback) => {
  const columnOrder = columns.map(d => d.field);
  copy(
    Papa.unparse(data, {
      delimiter: '\t',
      columns: columnOrder,
    }),
    {
      format: 'text/plain',
    }
  );
  callback();
};

/**
 * Utility function used to set the appropriate color
 * for a Material UI form input
 * @param {Enumerator} color enum "primary", "secondary", "info", "error"
 * @param {object} theme Material UI theme
 * @param {number} lightenFactor factor to lighten color by
 */
export const setInputColor = (color, theme, lightenFactor) => {
  const validColorOptions = ['primary', 'secondary', 'info', 'error'];
  if (validColorOptions.includes(color)) {
    if (lightenFactor) {
      return lighten(theme.palette[color].main, lightenFactor);
    }
    return theme.palette[color].main;
  }
  return null;
};

/**
 * Utility function used to assign the proper
 * class based on the variant
 * @param {string} variant i.e. standard, outlined, filled
 */
export const setClass = (classes, variant, classSuffix = 'TextField') => {
  if (variant === 'outlined') {
    return classes[`outlined${classSuffix}`];
  } else if (variant === 'filled') {
    return classes[`filled${classSuffix}`];
  } else {
    return classes[classSuffix];
  }
};

/**
 * Utility function used to return the appropriate width
 * for a form element
 * @param {number} width
 * @param {boolean} fullWidth
 */
export const setWidth = (width, fullWidth) => {
  if (fullWidth) {
    return '100%';
  } else if (width) {
    return width;
  } else {
    return 'inherit';
  }
};

/**
 * Utility function used to return the a formatted data
 * @param {date} "new Date"
 * @param {text} "YYYY MM DD, h:mm A"
 */
export const dateFormatter = (date, format) => {
  return moment(date).format(format);
};
