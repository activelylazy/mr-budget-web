import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import './App.css';
import Navigation from './navigation/NavigationContainer';
import Accounts from './accounts/AccountsContainer';
import Categories from './categories/CategoriesComponent';
import Review from './review/ReviewComponent';
import Import from './import/ImportContainer';
import * as areas from './navigation/navigation-areas';

const auth = {
  userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8b',
  password: 'Password1!',
};

function componentFor(area) {
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
    this.props.loadUserData(auth);
  }
  render() {
    const { area } = this.props;
    return (
      <div className="full-height">
        <Navigation />
        <div className="container-fluid container-no-padding full-height">
          {componentFor(area)}
        </div>
      </div>
    );
  }
}

AppComponent.propTypes = {
  area: PropTypes.string.isRequired,
  loadUserData: PropTypes.func.isRequired,
};

export default AppComponent;
