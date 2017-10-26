import { updateLastStatement } from '../user-data/user-data-actions';
import { importStatementData } from './statement/import-statement';
import { infoAlert, errorAlert } from '../app-actions';

export const STATEMENT_UPLOADED = 'STATEMENT_UPLOADED';
export const statementUploaded = statement => ({
  type: STATEMENT_UPLOADED,
  statement,
});

export const filterTransactions = (lastStatementDate, transactions) => {
  if (lastStatementDate === undefined) {
    return transactions;
  }
  return transactions.filter(t => t.date > lastStatementDate);
};

export const IMPORT_ACCOUNT_SELECTED = 'IMPORT_ACCOUNT_SELECTED';
export const setSelectedAccount = (accountId, filteredTransactions) => ({
  type: IMPORT_ACCOUNT_SELECTED,
  accountId: accountId === '' ? null : accountId,
  filteredTransactions,
});
export const importAccountSelected = accountId => (dispatch, getState) => {
  const account = getState().userData.accounts.find(a => a.id === accountId);
  const transactions = getState().statementImport.uploadedStatement.transactions;
  const filteredTransactions = filterTransactions(account.lastStatementDate, transactions);
  dispatch(setSelectedAccount(accountId, filteredTransactions));
};

export const IMPORT_STARTED = 'IMPORT_STARTED';
export const importStarted = () => ({
  type: IMPORT_STARTED,
});

export const IMPORT_FINISHED = 'IMPORT_FINISHED';
export const importFinished = () => ({
  type: IMPORT_FINISHED,
});

export const importStatement = () => (dispatch, getState) => {
  const statement = getState().statementImport.statement;
  const auth = getState().auth;
  const accountId = getState().statementImport.selectedAccountId;
  dispatch(importStarted());
  return importStatementData(auth, statement, accountId, dispatch, getState)
    .then(() =>
      updateLastStatement(auth, statement.date, statement.balance,
        accountId)(dispatch, getState))
    .then(() => dispatch(importFinished()))
    .then(() => dispatch(infoAlert('Statement imported')))
    .catch(error => dispatch(errorAlert(`Error importing statement: ${error}`)));
};

