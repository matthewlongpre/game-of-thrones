import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

export const Spinner = (props) => {
  return (
    <div className="spinner-container">
      <CircularProgress />
    </div>
  );
}
