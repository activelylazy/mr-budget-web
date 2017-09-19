import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default () => (
  <Navbar fixedTop collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#">Mr. Budget</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <NavItem eventKey={1} active className="accounts">Accounts</NavItem>
        <NavItem eventKey={2} className="categories">Categories</NavItem>
        <NavItem eventKey={3} className="review">Review</NavItem>
        <NavItem eventKey={4} className="import">Import</NavItem>
      </Nav>
      <Navbar.Text pullRight>
            Signed in as <u>Demo User</u>.
      </Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);
