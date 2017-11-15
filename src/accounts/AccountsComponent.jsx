import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, FormControl, InputGroup, Glyphicon, FormGroup } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { transactionsForAccount } from '../transactions/transaction-renderer';
import './accounts.css';
import AccountSelector from './AccountSelector';
import TransactionList from '../transactions/TransactionListComponent';
import MonthNavigation from '../transactions/MonthNavigationContainer';

function getMonthIfPresent(date) {
  return date === undefined ? undefined : date.getMonth();
}

function getYearIfPresent(date) {
  return date === undefined ? undefined : date.getFullYear();
}

class AccountsComponent extends Component {
  constructor() {
    super();
    this.toggleButton = this.toggleButton.bind(this);
    this.addAccountSubmit = this.addAccountSubmit.bind(this);
    this.addAccountNameChanged = this.addAccountNameChanged.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
    this.getAccountTransactions = this.getAccountTransactions.bind(this);
  }
  componentWillMount() {
    this.setState({
      showInput: false,
      accountName: '',
    });
  }
  getValidationState() {
    const length = this.state.accountName.length;
    if (length > 2) {
      return 'success';
    }
    return 'error';
  }
  getAccountTransactions() {
    if (this.props.selectedAccountId === undefined ||
      this.props.monthData === undefined) {
      return [];
    }
    return transactionsForAccount(this.props.monthData, this.props.selectedAccountId);
  }
  getAccountOpeningDate() {
    if (this.props.selectedAccountId === undefined) {
      return undefined;
    }
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .openingDate;
  }
  getAccountStatementDate() {
    if (this.props.selectedAccountId === undefined) {
      return undefined;
    }
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .lastStatementDate;
  }
  getAccountTitle() {
    if (this.props.selectedAccountId === undefined) {
      return undefined;
    }
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .name;
  }
  getAccountOpeningBalance() {
    if (this.props.selectedAccountId === undefined) {
      return undefined;
    }
    return this.props.accounts
      .find(a => a.id === this.props.selectedAccountId)
      .openingBalance;
  }
  addAccountSubmit(e) {
    if (this.getValidationState() === 'success') {
      this.props.addAccount(this.state.accountName);
      this.setState({
        showInput: false,
        accountName: '',
      });
    }
    e.preventDefault();
  }
  toggleButton() {
    this.setState({ showInput: true });
  }
  addAccountNameChanged(e) {
    this.setState({
      showInput: true,
      accountName: e.target.value,
    });
  }
  renderAddInput() {
    if (this.state.showInput) {
      return (
        <form key="add-form" onSubmit={this.addAccountSubmit}>
          <FormGroup validationState={this.getValidationState()}>
            <InputGroup>
              <FormControl
                type="text"
                placeholder="Account name"
                onChange={this.addAccountNameChanged}
                autoFocus
                id="add-account-name"
                autoComplete="off"
              />
              <InputGroup.Button>
                <Button id="add-account-submit" type="submit"><Glyphicon glyph="ok" /></Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>
      );
    }
    return (<div key="empty" />);
  }
  renderAddButton() {
    if (this.state.showInput) {
      return (
        <Button
          key="add-button"
          bsStyle="primary"
          onClick={() => this.toggleButton()}
          id="add-account-button"
          disabled
        >
          Add Account
        </Button>
      );
    }
    return (
      <Button
        key="add-button"
        bsStyle="primary"
        onClick={() => this.toggleButton()}
        id="add-account-button"
      >
        Add Account
      </Button>
    );
  }
  render() {
    return (
      <div className="row full-height account-list">
        <div className="col-md-3 col-sm-12 full-height left-list">
          <ReactCSSTransitionGroup
            transitionName="account-list-transition"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {this.props.accounts.map(account =>
              (
                <AccountSelector
                  key={account.name}
                  account={account}
                  onSelect={() => this.props.selectAccount(account.id)}
                />
              ))}
            {this.renderAddInput()}
            {this.renderAddButton()}
          </ReactCSSTransitionGroup>
        </div>
        <div className="col-md-9 right-full">
          <MonthNavigation
            startMonth={getMonthIfPresent(this.getAccountOpeningDate())}
            startYear={getYearIfPresent(this.getAccountOpeningDate())}
            endMonth={getMonthIfPresent(this.getAccountStatementDate())}
            endYear={getYearIfPresent(this.getAccountStatementDate())}
            title={this.getAccountTitle()}
          />
          <TransactionList
            transactions={this.getAccountTransactions()}
            openingBalance={this.getAccountOpeningBalance()}
          />
        </div>
      </div>
    );
  }
}

AccountsComponent.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    openingDate: PropTypes.instanceOf(Date),
  })).isRequired,
  selectAccount: PropTypes.func.isRequired,
  monthData: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
  }),
  selectedAccountId: PropTypes.string,
};

AccountsComponent.defaultProps = {
  monthData: undefined,
  selectedAccountId: undefined,
};

export default AccountsComponent;
