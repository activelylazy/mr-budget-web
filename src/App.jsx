import React from 'react';
import './App.css';
import Navigation from './navigation/NavigationContainer';
import Accounts from './accounts/AccountsComponent';

export default () => (
  <div className="full-height">
    <Navigation />
    <div className="container-fluid container-no-padding full-height">
      <Accounts />
    </div>
  </div>
);
