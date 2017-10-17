import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import App from './AuthenticatedAppComponent';
import Accounts from './accounts/AccountsContainer';
import Categories from './categories/CategoriesComponent';
import Review from './review/ReviewComponent';
import Import from './import/ImportContainer';

should();

describe('app component', () => {
  it('shows accounts when accounts area selected', () => {
    const app = shallow(<App area="ACCOUNTS" loadUserData={() => {}} />);

    assert(app.find(Accounts).exists());
    assert(!app.find(Categories).exists());
  });

  it('shows categories when categories area selected', () => {
    const app = shallow(<App area="CATEGORIES" loadUserData={() => {}} />);

    assert(app.find(Categories).exists());
  });

  it('shows review when review area selected', () => {
    const app = shallow(<App area="REVIEW" loadUserData={() => {}} />);

    assert(app.find(Review).exists());
  });

  it('shows import when import area selected', () => {
    const app = shallow(<App area="IMPORT" loadUserData={() => {}} />);

    assert(app.find(Import).exists());
  });
});
