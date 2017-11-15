import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import './transactions.css';

function monthString(month) {
  switch (month) {
    case 0: return 'January';
    case 1: return 'February';
    case 2: return 'March';
    case 3: return 'April';
    case 4: return 'May';
    case 5: return 'June';
    case 6: return 'July';
    case 7: return 'August';
    case 8: return 'September';
    case 9: return 'October';
    case 10: return 'November';
    case 11: return 'December';
    default: return undefined;
  }
}

function isPrevDisabled(currentMonth, currentYear, startMonth, startYear) {
  if (currentYear < startYear) {
    return true;
  }
  return currentMonth <= startMonth && currentYear === startYear;
}

function isNextDisabled(currentMonth, currentYear, endMonth, endYear) {
  if (currentYear > endYear) {
    return true;
  }
  return currentMonth >= endMonth && currentYear === endYear;
}

function prevMonth(month, year, changePeriod) {
  if (month > 0) {
    changePeriod(year, month - 1);
  } else {
    changePeriod(year - 1, 11);
  }
}

function nextMonth(month, year, changePeriod) {
  if (month < 11) {
    changePeriod(year, month + 1);
  } else {
    changePeriod(year + 1, 0);
  }
}

const MonthNavigationComponent = ({ currentMonth, currentYear, startMonth,
  startYear, endMonth, endYear, changePeriod, title }) => {
  if (currentMonth !== undefined && currentYear !== undefined) {
    return (
      <div className="transaction-list-navigation">
        <div className="month-navigation">
          <Button
            bsSize="large"
            id="prev-month"
            disabled={isPrevDisabled(currentMonth, currentYear, startMonth, startYear)}
            onClick={() => prevMonth(currentMonth, currentYear, changePeriod)}
          >
            <Glyphicon glyph="arrow-left" />
          </Button>
          <span id="title">
            {title}
          </span>
          <span id="current-month">
            {monthString(currentMonth)} {currentYear}
          </span>
          <Button
            bsSize="large"
            id="next-month"
            disabled={isNextDisabled(currentMonth, currentYear, endMonth, endYear)}
            onClick={() => nextMonth(currentMonth, currentYear, changePeriod)}
          >
            <Glyphicon glyph="arrow-right" />
          </Button>
        </div>
      </div>
    );
  }
  return (<div className="transaction-list-navigaation" />);
};

MonthNavigationComponent.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  startMonth: PropTypes.number,
  startYear: PropTypes.number,
  endMonth: PropTypes.number,
  endYear: PropTypes.number,
  changePeriod: PropTypes.func.isRequired,
  title: PropTypes.string,
};

MonthNavigationComponent.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  startMonth: undefined,
  startYear: undefined,
  endMonth: undefined,
  endYear: undefined,
  title: undefined,
};

export default MonthNavigationComponent;
