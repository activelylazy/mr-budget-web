import parseOfx from '../ofx/parse-ofx';
import { updateLastStatement, updateOpeningBalance, saveUserData } from '../user-data/user-data-actions';
import { importStatementData, openingBalance } from './statement/statement-actions';
import { statementUploaded, importStarted, importFinished,
  filterTransactions, setSelectedAccount } from './import-actions';
import { infoAlert, errorAlert } from '../app-actions';

export const readStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)))
    .catch(error => dispatch(errorAlert('Error uploading statement', error)));

export const importStatement = () => (dispatch, getState) => {
  const statement = getState().statementImport.statement;
  const auth = getState().auth;
  const accountId = getState().statementImport.selectedAccountId;
  if (getState().statementImport.importInProgress) {
    return Promise.resolve();
  }
  dispatch(importStarted());
  return importStatementData(auth, statement, accountId, dispatch, getState)
    .then(() => dispatch(updateLastStatement(statement.date, statement.balance, accountId)))
    .then(() => dispatch(
      updateOpeningBalance(statement.startDate, openingBalance(statement), accountId)))
    .then(() => saveUserData(auth, getState().userData))
    .then(() => dispatch(importFinished()))
    .then(() => dispatch(infoAlert('Statement imported')))
    .catch(error => dispatch(errorAlert('Error importing statement', error)));
};

export const importAccountSelected = accountId => (dispatch, getState) => {
  const account = getState().userData.accounts.find(a => a.id === accountId);
  const transactions = getState().statementImport.uploadedStatement.transactions;
  const filteredTransactions = filterTransactions(account.lastStatementDate, transactions);
  dispatch(setSelectedAccount(accountId, filteredTransactions));
};
