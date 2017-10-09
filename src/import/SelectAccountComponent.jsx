import React from 'react';
import { PropTypes } from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const SelectAccount = ({ accounts }) => {
  const accountOptions = accounts.map(account => (
    <option>{account.name}</option>
  ));
  return (
    <div className="select-account">
      <div className="import-select-account">
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Account</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="select">Choose account to import into</option>
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
};

export default SelectAccount;
