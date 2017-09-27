import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';

const AccountsSelector = ({ account }) => (
  <div className="account">
    <Button
      bsStyle="default"
      block
    >
      <table className="account-selector-table">
        <tr>
          <td>{account.name}</td>
          <td rowSpan="2" className="account-balance">
            £ 123.45
          </td>
        </tr>
        <tr>
          <td>
            <span style={{ fontSize: '8pt' }}>last updated yesterday</span>
          </td>
        </tr>
      </table>
    </Button>
  </div>
);

AccountsSelector.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default AccountsSelector;
