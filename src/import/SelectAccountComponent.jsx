import React from 'react';
import { PropTypes } from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const SelectAccount = ({ accounts, onAccountSelected }) => {
  const accountOptions = accounts.map(account => (
    <option key={account.name} value={account.id}>{account.name}</option>
  ));
  return (
    <div className="select-account">
      <div className="import-select-account">
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Account</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="select"
            onChange={e => onAccountSelected(e.target.value)}
            autoFocus
          >
            <option key="select" value="">Choose account to import into</option>
            {accountOptions}
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
};

SelectAccount.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  onAccountSelected: PropTypes.func.isRequired,
};

export default SelectAccount;
