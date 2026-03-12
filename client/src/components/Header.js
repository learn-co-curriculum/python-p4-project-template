import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title, subtitle }) => (
  <header className="app-header">
    <h1>{title}</h1>
    {subtitle && <p className="subtitle">{subtitle}</p>}
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Header;
