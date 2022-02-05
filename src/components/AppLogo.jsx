import './AppLogo.css';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import config from '../data/app.json';

function AppLogo({ className }) {
  return (
    <div className={classnames('AppLogo', className)}>
      <span className="AppLogo-abbr">{config.TOKEN_SYMBOL}</span>
      <h1 className="AppLogo-title">{config.TOKEN_NAME}</h1>
    </div>
  );
}

AppLogo.defaultProps = {
  className: '',
};

AppLogo.propTypes = {
  className: PropTypes.string,
};

export default AppLogo;
