import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import relativeDate from 'relative-date';

const AccountsSelector = ({ account }) => (
  <div className="account">
    <Button
      bsStyle="default"
      block
    >
      <table className="account-selector-table">
        <tbody>
          <tr>
            <td className="account-name">{account.name}</td>
            <td rowSpan="2" className="account-balance">
              £ {account.lastStatementBalance}
            </td>
          </tr>
          <tr>
            <td className="account-updated">
              <span style={{ fontSize: '8pt' }}>last updated {relativeDate(account.lastStatementDate)}</span>
            </td>
          </tr>
        </tbody>
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
