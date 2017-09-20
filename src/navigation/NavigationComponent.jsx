import React from 'react';
import { PropTypes } from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import * as areas from './navigation-areas';

const Navigation = ({ changeArea }) => (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Mr. Budget</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem
          eventKey={1}
          active
          className="accounts"
          onClick={() => changeArea(areas.ACCOUNTS)}
        >
          Accounts
        </NavItem>
        <NavItem
          eventKey={2}
          className="categories"
          onClick={() => changeArea(areas.CATEGORIES)}
        >
          Categories
        </NavItem>
        <NavItem
          eventKey={3}
          className="review"
          onClick={() => changeArea(areas.REVIEW)}
        >
          Review
        </NavItem>
        <NavItem
          eventKey={4}
          className="import"
          onClick={() => changeArea(areas.IMPORT)}
        >
          Import
        </NavItem>
      </Nav>
      <Navbar.Text pullRight>
            Signed in as <u>Demo User</u>.
      </Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);

Navigation.propTypes = {
  changeArea: PropTypes.func.isRequired,
};

export default Navigation;
