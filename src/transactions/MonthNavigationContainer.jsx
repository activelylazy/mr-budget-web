import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import MonthNavigation from './MonthNavigationComponent';
import { navigateToPeriod } from '../navigation/navigation-actions';

const MonthNavigationContainer = props => (
  <MonthNavigation
    currentMonth={props.currentMonth}
    currentYear={props.currentYear}
    startMonth={props.startMonth}
    startYear={props.startYear}
    endMonth={props.endMonth}
    endYear={props.endYear}
    changePeriod={props.navigateToPeriod}
  />
);

MonthNavigationContainer.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  startMonth: PropTypes.number,
  startYear: PropTypes.number,
  endMonth: PropTypes.number,
  endYear: PropTypes.number,
  navigateToPeriod: PropTypes.func.isRequired,
};

MonthNavigationContainer.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  startMonth: undefined,
  startYear: undefined,
  endMonth: undefined,
  endYear: undefined,
};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps, { navigateToPeriod })(MonthNavigationContainer);
