import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Navigation from './NavigationComponent';
import { changeArea } from './navigation-actions';

const NavigationContainer = props => (
  <Navigation changeArea={props.changeArea} />
);

NavigationContainer.propTypes = {
  changeArea: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {

  };
}

export default connect(mapStateToProps, { changeArea })(NavigationContainer);
