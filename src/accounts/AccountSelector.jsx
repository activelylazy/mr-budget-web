import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from 'react-bootstrap';
import moment from 'moment';

const accountBalance = (account) => {
  if (account.lastStatementBalance !== undefined) {
    return (<td rowSpan="2" className="account-balance">
      £ {account.lastStatementBalance}
    </td>
    );
  }
  return (<td rowSpan="2" />);
};

const accountUpdated = (account) => {
  if (account.lastStatementDate !== undefined) {
    return (<td className="account-updated">
      last updated {moment(account.lastStatementDate).fromNow()}
    </td>
    );
  }
  return (<td className="account-updated">&nbsp;</td>);
};

const AccountsSelector = ({ account, onSelect }) => (
  <div className="account">
    <Button
      bsStyle="default"
      block
      onClick={() => onSelect()}
    >
      <table className="account-selector-table">
        <tbody>
          <tr>
            <td className="account-name">{account.name}</td>
            {accountBalance(account)}
          </tr>
          <tr>
            {accountUpdated(account)}
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
  onSelect: PropTypes.func.isRequired,
};

export default AccountsSelector;
