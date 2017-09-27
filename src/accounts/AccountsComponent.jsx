import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Button, FormControl, InputGroup, Glyphicon, FormGroup } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './accounts.css';
import AccountSelector from './AccountSelector';

class AccountsComponent extends Component {
  constructor() {
    super();
    this.toggleButton = this.toggleButton.bind(this);
    this.addAccountSubmit = this.addAccountSubmit.bind(this);
    this.addAccountNameChanged = this.addAccountNameChanged.bind(this);
    this.toggleButton = this.toggleButton.bind(this);
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
  toggleButton() {
    this.setState({ showInput: true });
  }
  addAccountNameChanged(e) {
    this.setState({
      showInput: true,
      accountName: e.target.value,
    });
  }
  addAccountSubmit(e) {
    if (this.getValidationState() === 'success') {
      console.log(`new account: ${this.state.accountName}`);
      this.props.addAccount(this.state.accountName);
      this.setState({
        showInput: false,
        accountName: '',
      });
    }
    e.preventDefault();
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
            {this.props.accounts.map(account => (<AccountSelector key={account} account={account} />))}
            {this.renderAddInput()}
            {this.renderAddButton()}
          </ReactCSSTransitionGroup>
        </div>
        <div className="col-md-9 right-list">
          <ul>
            <li>A transaction</li>
            <li>Another transaction</li>
          </ul>
        </div>
      </div>
    );
  }
}

AccountsComponent.propTypes = {
  addAccount: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AccountsComponent;
