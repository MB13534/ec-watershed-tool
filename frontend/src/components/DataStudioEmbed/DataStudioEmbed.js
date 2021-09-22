import React from 'react';
import PropTypes from 'prop-types';

const DataStudioEmbed = ({ src, title, width = '100%', height = 1200 }) => {
  return <iframe title={title} src={src} width={width} height={height} frameBorder={0} />;
};

DataStudioEmbed.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DataStudioEmbed;
