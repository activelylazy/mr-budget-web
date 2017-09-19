import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Navigation from './NavigationComponent';
import * as actions from './navigation-actions';

const NavigationContainer = ({ changeArea }) => (
  <Navigation changeArea={changeArea} />
);

NavigationContainer.propTypes = {
  changeArea: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeArea: area => dispatch(actions.navigateTo(area)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationContainer);
