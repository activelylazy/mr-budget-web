import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Import from './ImportComponent';
import { importStatement, importAccountSelected, importStatementToAccount } from './import-actions';

const ImportContainer = props => (
  <Import
    onUpload={props.importStatement}
    statement={props.statement}
    accounts={props.accounts}
    onAccountSelected={props.importAccountSelected}
    selectedAccountId={props.selectedAccountId}
    onImport={props.importStatementToAccount}
  />
);

ImportContainer.propTypes = {
  importStatement: PropTypes.func.isRequired,
  statement: PropTypes.shape({
    transactions: PropTypes.array.isRequired,
  }),
  accounts: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
  importAccountSelected: PropTypes.func.isRequired,
  selectedAccountId: PropTypes.string,
  importStatementToAccount: PropTypes.func.isRequired,
};

ImportContainer.defaultProps = {
  statement: undefined,
  selectedAccountId: undefined,
};


function mapStateToProps(state) {
  return {
    statement: state.statementImport.statement,
    accounts: state.userData.accounts,
    selectedAccountId: state.statementImport.selectedAccountId,
  };
}

export default connect(
  mapStateToProps,
  { importStatement, importAccountSelected, importStatementToAccount })(ImportContainer);
