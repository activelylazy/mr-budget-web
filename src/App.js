import React, { Component } from 'react';
import { Button, Navbar, Nav, NavItem } from 'react-bootstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="full-height">
        <Navbar fixedTop='true' collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Mr. Budget</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={() => { /* nothing */} }>Accounts</NavItem>
              <NavItem eventKey={2} onClick={() => { /* nothing */} }>Categories</NavItem>
              <NavItem eventKey={3} onClick={() => { /* nothing */} }>Review</NavItem>
              <NavItem eventKey={4} onClick={() => { /* nothing */} }>Import</NavItem>
            </Nav>
            <Navbar.Text pullRight>
              Signed in as <u>Demo User</u>.
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <div className="container-fluid container-no-padding full-height">
          <div className="row" className="full-height">
            <div className="col-md-3 col-sm-12 full-height left-list">
              <ul>
                <li>Account one</li>
                <li>Account two</li>
              </ul>
            </div>
            <div className="col-md-9 right-list">
              <ul>
                <li>A transaction</li>
                <li>Another transaction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
