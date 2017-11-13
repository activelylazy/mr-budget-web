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

const MonthNavigationComponent = ({ currentMonth, currentYear, startMonth,
  startYear, endMonth, endYear }) => {
  if (currentMonth !== undefined && currentYear !== undefined) {
    return (
      <div className="transaction-list-navigation">
        <Button
          bsSize="large"
          id="prev-month"
          disabled={currentMonth === startMonth && currentYear === startYear}
        >
          <Glyphicon glyph="arrow-left" />
        </Button>
        <span id="current-month">
          {monthString(currentMonth)} {currentYear}
        </span>
        <Button
          bsSize="large"
          id="next-month"
          disabled={currentMonth === endMonth && currentYear === endYear}
        >
          <Glyphicon glyph="arrow-right" />
        </Button>
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
};

MonthNavigationComponent.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  startMonth: undefined,
  startYear: undefined,
  endMonth: undefined,
  endYear: undefined,
};

export default MonthNavigationComponent;
