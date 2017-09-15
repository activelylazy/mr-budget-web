import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Tabs, Tab } from './tabs';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
              <Tabs>
                <Tab title="Accounts">
                  <div>Some content</div>
                </Tab>
                <Tab title="Categories">
                  <div>More content</div>
                </Tab>
              </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
