import React from 'react';
import { PropTypes } from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import * as areas from './navigation-areas';

const renderNavItem = (name, number, changeArea, currentArea, area, label) => {
  if (currentArea === area) {
    return (
      <NavItem
        eventKey={number}
        active
        className={name}
        onClick={() => changeArea(area)}
      >
        {label}
      </NavItem>
    );
  }
  return (
    <NavItem
      eventKey={number}
      className={name}
      onClick={() => changeArea(area)}
    >
      {label}
    </NavItem>
  );
};
const Navigation = ({ changeArea, currentArea }) => (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a>Mr. Budget</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        {renderNavItem('accounts', 1, changeArea, currentArea, areas.ACCOUNTS, 'Accounts')}
        {renderNavItem('categories', 2, changeArea, currentArea, areas.CATEGORIES, 'Categories')}
        {renderNavItem('review', 3, changeArea, currentArea, areas.REVIEW, 'Review')}
        {renderNavItem('import', 4, changeArea, currentArea, areas.IMPORT, 'Import')}
      </Nav>
      <Navbar.Text pullRight>
            Signed in as <u>Demo User</u>.
      </Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);

Navigation.propTypes = {
  changeArea: PropTypes.func.isRequired,
  currentArea: PropTypes.string.isRequired,
};

export default Navigation;
