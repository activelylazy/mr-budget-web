import React from 'react';
import { PropTypes } from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import './transactions.css';

const MonthNavigationComponent = () => (
  <div className="transaction-list-navigation">
    <Button bsSize="large">
      <Glyphicon glyph="arrow-left" />
    </Button>
    <span className="current-month">
      October 2017
    </span>
    <Button bsSize="large">
      <Glyphicon glyph="arrow-right" />
    </Button>
  </div>
);

export default MonthNavigationComponent;
