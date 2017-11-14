import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import MonthNavigation from './MonthNavigationComponent';
import { loadAndViewFinancialDataForPeriod } from '../navigation/navigation-thunk';

const MonthNavigationContainer = props => (
  <MonthNavigation
    currentMonth={props.currentMonth}
    currentYear={props.currentYear}
    startMonth={props.startMonth}
    startYear={props.startYear}
    endMonth={props.endMonth}
    endYear={props.endYear}
    changePeriod={(year, month) => props.loadAndViewFinancialDataForPeriod(props.auth, year, month)}
  />
);

MonthNavigationContainer.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  startMonth: PropTypes.number,
  startYear: PropTypes.number,
  endMonth: PropTypes.number,
  endYear: PropTypes.number,
  loadAndViewFinancialDataForPeriod: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    password: PropTypes.string.isRequired,
  }).isRequired,
};

MonthNavigationContainer.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  startMonth: undefined,
  startYear: undefined,
  endMonth: undefined,
  endYear: undefined,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}
export default connect(mapStateToProps, { loadAndViewFinancialDataForPeriod })(MonthNavigationContainer);
