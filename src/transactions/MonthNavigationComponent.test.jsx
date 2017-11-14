import React from 'react';
import { shallow } from 'enzyme';
import { assert, should } from 'chai';
import sinon from 'sinon';
import { Button } from 'react-bootstrap';
import MonthNavigationComponent from './MonthNavigationComponent';

should();

describe('month navigation component', () => {
  const changePeriod = sinon.stub();

  it('renders no buttons with no current month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        changePeriod={changePeriod}
      />,
    );

    assert(navigation.find(Button).exists().should.equal(false));
  });

  it('renders buttons with current month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
        changePeriod={changePeriod}
      />,
    );

    assert(navigation.find(Button).length.should.equal(2));
  });

  it('renders current month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
        changePeriod={changePeriod}
      />,
    );

    assert(navigation.find('#current-month').text().should.equal('August 2017'));
  });

  it('renders prev month as disabled when showing start month & year', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={7}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        changePeriod={changePeriod}
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
        changePeriod={changePeriod}
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
        changePeriod={changePeriod}
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
        changePeriod={changePeriod}
      />);

    assert(navigation.find('#next-month').prop('disabled').should.equal(false));
  });

  it('navigates to previous month on click prev month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={9}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        endMonth={10}
        endYear={2017}
        changePeriod={changePeriod}
      />);

    const prevMonth = navigation.find('#prev-month');
    prevMonth.prop('onClick')();

    assert(changePeriod.calledWith(2017, 8));
  });

  it('navigates to last month of previous year on click prev month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={0}
        currentYear={2017}
        startMonth={7}
        startYear={2016}
        endMonth={10}
        endYear={2017}
        changePeriod={changePeriod}
      />);

    const prevMonth = navigation.find('#prev-month');
    prevMonth.prop('onClick')();

    assert(changePeriod.calledWith(2016, 11));
  });

  it('navigates to next month on click next month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={9}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        endMonth={10}
        endYear={2017}
        changePeriod={changePeriod}
      />);

    const nextMonth = navigation.find('#next-month');
    nextMonth.prop('onClick')();

    assert(changePeriod.calledWith(2017, 10));
  });

  it('navigates to first month of next year on click next month', () => {
    const navigation = shallow(
      <MonthNavigationComponent
        currentMonth={11}
        currentYear={2017}
        startMonth={7}
        startYear={2017}
        endMonth={10}
        endYear={2018}
        changePeriod={changePeriod}
      />);

    const nextMonth = navigation.find('#next-month');
    nextMonth.prop('onClick')();

    assert(changePeriod.calledWith(2018, 0));
  });
});
