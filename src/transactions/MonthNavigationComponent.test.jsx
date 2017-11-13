import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import { Button } from 'react-bootstrap';
import MonthNavigationComponent from './MonthNavigationComponent';

should();

describe('month navigation component', () => {
  it('renders no buttons with no current month', () => {
    const navigation = shallow(
      <MonthNavigationComponent />,
    );

    assert(navigation.find(Button).exists().should.equal(false));
  });

  it('renders buttons with current month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
      />,
    );

    assert(navigation.find(Button).length.should.equal(2));
  });
});
