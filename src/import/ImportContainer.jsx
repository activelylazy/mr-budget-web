import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Import from './ImportComponent';
import { readStatement, importAccountSelected, importStatementToAccount } from './import-actions';
import { errorAlert } from '../app-actions';

const ImportContainer = props => (
  <Import
    onUpload={props.readStatement}
    statement={props.statement}
    accounts={props.accounts}
    onAccountSelected={props.importAccountSelected}
    selectedAccountId={props.selectedAccountId}
    onImport={props.importStatementToAccount}
    importInProgress={props.importInProgress}
  />
);

ImportContainer.propTypes = {
  readStatement: PropTypes.func.isRequired,
  statement: PropTypes.shape({
    transactions: PropTypes.array.isRequired,
  }),
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  importAccountSelected: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  importStatementToAccount: PropTypes.func.isRequired,
  importInProgress: PropTypes.bool.isRequired,
};

ImportContainer.defaultProps = {
  statement: undefined,
  selectedAccountId: undefined,
};


function mapStateToProps(state) {
  return {
    statement: state.statementImport.uploadedStatement,
    accounts: state.userData.accounts,
    selectedAccountId: state.statementImport.selectedAccountId,
    importInProgress: state.statementImport.importInProgress,
  };
}

export default connect(
  mapStateToProps,
  { readStatement,
    importAccountSelected,
    importStatementToAccount,
    errorAlert })(ImportContainer);
