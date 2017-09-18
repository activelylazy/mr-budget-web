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
        <NavItem eventKey={1} active>Accounts</NavItem>
        <NavItem eventKey={2}>Categories</NavItem>
        <NavItem eventKey={3}>Review</NavItem>
        <NavItem eventKey={4}>Import</NavItem>
      </Nav>
      <Navbar.Text pullRight>
            Signed in as <u>Demo User</u>.
      </Navbar.Text>
    </Navbar.Collapse>
  </Navbar>
);
