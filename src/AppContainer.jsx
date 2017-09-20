import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import App from './AppComponent';

const AppContainer = props => (
  <App area={props.area} />
);

AppContainer.propTypes = {
  area: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    area: state.navigation.area,
  };
}

export default connect(mapStateToProps)(AppContainer);
