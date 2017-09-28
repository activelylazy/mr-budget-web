import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Navigation from './NavigationComponent';
import { changeArea } from './navigation-actions';

const NavigationContainer = props => (
  <Navigation changeArea={props.changeArea} currentArea={props.currentArea} />
);

NavigationContainer.propTypes = {
  changeArea: PropTypes.func.isRequired,
  currentArea: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    currentArea: state.navigation.area,
  };
}

export default connect(mapStateToProps, { changeArea })(NavigationContainer);
