import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import App from './AppComponent';
import Accounts from './accounts/AccountsComponent';

should();

describe('app component', () => {
  it('shows accounts when accounts area selected', () => {
    const app = shallow(<App area="ACCOUNTS" />);

    assert(app.find(Accounts).length.should.equal(1));
  });
});
