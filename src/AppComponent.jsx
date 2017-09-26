import React from 'react';
import { PropTypes } from 'prop-types';
import './App.css';
import Navigation from './navigation/NavigationContainer';
import Accounts from './accounts/AccountsContainer';
import Categories from './categories/CategoriesComponent';
import Review from './review/ReviewComponent';
import Import from './import/ImportComponent';
import * as areas from './navigation/navigation-areas';

function componentFor(area) {
  if (area === areas.ACCOUNTS) {
    return (<Accounts addAccount={() => { }} />);
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
const AppComponent = ({ area }) => (
  <div className="full-height">
    <Navigation />
    <div className="container-fluid container-no-padding full-height">
      {componentFor(area)}
    </div>
  </div>
);

AppComponent.propTypes = {
  area: PropTypes.string.isRequired,
};

export default AppComponent;
