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

  it('renders prev month as disabled when showing start month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
      />);

    assert(navigation.find('#prev-month').prop('disabled'));
  });

  it('renders prev month as enabled when showing period after start', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
        startMonth={4}
        startYear={2017}
      />);

    assert(navigation.find('#prev-month').prop('disabled').should.equal(false));
  });

  it('renders next month as disabled when showing end month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={10}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        endMonth={10}
        endYear={2017}
      />);

    assert(navigation.find('#next-month').prop('disabled'));
  });

  it('renders next month as enabled when not showing end month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={9}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        endMonth={10}
        endYear={2017}
      />);

    assert(navigation.find('#next-month').prop('disabled').should.equal(false));
  });
});
