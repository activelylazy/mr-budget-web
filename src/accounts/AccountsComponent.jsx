import React from 'react';

const AccountsComponent = () => (
  <div className="row full-height">
    <div className="col-md-3 col-sm-12 full-height left-list">
      <ul>
        <li>Account one</li>
        <li>Account two</li>
      </ul>
    </div>
    <div className="col-md-9 right-list">
      <ul>
        <li>A transaction</li>
        <li>Another transaction</li>
      </ul>
    </div>
  </div>
);

export default AccountsComponent;
