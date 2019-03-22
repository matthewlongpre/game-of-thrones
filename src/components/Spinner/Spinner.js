import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Spinner = (props) => {
  return (
    <div className="spinner-container">
      <CircularProgress />
    </div>
  );
}
