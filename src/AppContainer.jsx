import React from 'react';
import { connect } from 'react-redux';
import App from './AppComponent';

const AppContainer = () => (
  <App />
);

export default connect()(AppContainer);
