import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import './transactions.css';

const MonthNavigationComponent = ({ currentMonth, currentYear, startMonth, startYear }) => {
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
        <span className="current-month">
          October 2017
        </span>
        <Button bsSize="large" id="next-month">
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
};

MonthNavigationComponent.defaultProps = {
  currentMonth: undefined,
  currentYear: undefined,
  startMonth: undefined,
  startYear: undefined,
};

export default MonthNavigationComponent;
