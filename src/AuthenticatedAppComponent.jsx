import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import './App.css';
import Navigation from './navigation/NavigationContainer';
import Accounts from './accounts/AccountsContainer';
import Categories from './categories/CategoriesComponent';
import Review from './review/ReviewComponent';
import Import from './import/ImportContainer';
import * as areas from './navigation/navigation-areas';

function componentFor(area, auth) {
  if (area === areas.ACCOUNTS) {
    return (<Accounts auth={auth} />);
  }
  if (area === areas.CATEGORIES) {
    return (<Categories />);
  }
  if (area === areas.REVIEW) {
    return (<Review />);
  }
  if (area === areas.IMPORT) {
    return (<Import />);
  }
  return (<div />);
}
class AppComponent extends Component {
  componentDidMount() {
    this.props.loadUserData(this.props.auth);
  }
  render() {
    const { area, auth } = this.props;
    return (
      <div className="full-height">
        <Navigation />
        <div className="container-fluid container-no-padding full-height">
          {componentFor(area, auth)}
        </div>
      </div>
    );
  }
}

AppComponent.propTypes = {
  area: PropTypes.string.isRequired,
  loadUserData: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }),
};

AppComponent.defaultProps = {
  auth: undefined,
};

export default AppComponent;
