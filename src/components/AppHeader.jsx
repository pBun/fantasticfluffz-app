import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import AppLogo from './AppLogo';

import './AppHeader.css';

function AppHeader({ className }) {
  return (
    <header className={classnames('AppHeader', className)}>
      <Link className="AppHeader-logo" to="/">
        <AppLogo />
      </Link>
    </header>
  );
}

AppHeader.defaultProps = {
  className: '',
};

AppHeader.propTypes = {
  className: PropTypes.string,
};

export default AppHeader;
