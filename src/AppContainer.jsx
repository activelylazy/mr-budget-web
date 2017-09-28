import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import App from './AppComponent';
import { loadUserData } from './accounts/accounts-actions';

const AppContainer = props => (
  <App
    area={props.area}
    loadUserData={props.loadUserData}
  />
);

AppContainer.propTypes = {
  area: PropTypes.string.isRequired,
  loadUserData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    area: state.navigation.area,
  };
}

export default connect(mapStateToProps, { loadUserData })(AppContainer);
