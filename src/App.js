import React, { Component } from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Tabs, Tab } from './tabs';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navbar fixedTop='true'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Mr. Budget</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="#">Accounts</NavItem>
            <NavItem eventKey={2} href="#">Categories</NavItem>
            <NavItem eventKey={3} href="#">Review</NavItem>
            <NavItem eventKey={4} href="#">Import</NavItem>
          </Nav>
          <Navbar.Text pullRight>
            Signed in as <u>Demo User</u>.
          </Navbar.Text>
        </Navbar>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
              More content<br/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
