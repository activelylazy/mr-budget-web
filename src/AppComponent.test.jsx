import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import App from './AppComponent';
import Accounts from './accounts/AccountsComponent';
import Categories from './categories/CategoriesComponent';

should();

describe('app component', () => {
  it('shows accounts when accounts area selected', () => {
    const app = shallow(<App area="ACCOUNTS" />);

    assert(app.find(Accounts).exists());
    assert(!app.find(Categories).exists());
  });

  it('shows categories when categories area selected', () => {
    const app = shallow(<App area="CATEGORIES" />);

    assert(app.find(Categories).exists());
  });
});
