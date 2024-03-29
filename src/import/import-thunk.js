import parseOfx from '../ofx/parse-ofx';
import { updateLastStatement, updateAccountOpeningBalance, saveUserData } from '../user-data/user-data-actions';
import { importStatementData, openingBalance } from './statement/statement-actions';
import { statementUploaded, importStarted, importFinished,
  filterTransactions, setSelectedAccount } from './import-actions';
import { updateOpeningBalances } from '../financial-data/financial-data-actions';
import { infoAlert, onError } from '../app-actions';

export const readStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)))
    .catch(error => onError(dispatch, 'Error uploading statement', error));

export const importStatement = () => (dispatch, getState) => {
  const statement = getState().statementImport.statement;
  const auth = getState().auth;
  const accountId = getState().statementImport.selectedAccountId;
  if (getState().statementImport.importInProgress) {
    return Promise.resolve();
  }
  dispatch(importStarted());
  return importStatementData(auth, statement, accountId, dispatch, getState)
    .then(() => dispatch(
      updateAccountOpeningBalance(statement.startDate, openingBalance(statement), accountId)))
    .then(() => updateOpeningBalances(auth, accountId, statement, dispatch, getState))
    .then(() => dispatch(updateLastStatement(statement.date, statement.balance, accountId)))
    .then(() => saveUserData(auth, getState().userData))
    .then(() => dispatch(importFinished()))
    .then(() => dispatch(infoAlert('Statement imported')))
    .catch(error => onError(dispatch, 'Error importing statement', error));
};

export const importAccountSelected = accountId => (dispatch, getState) => {
  const account = getState().userData.accounts.find(a => a.id === accountId);
  const transactions = getState().statementImport.uploadedStatement.transactions;
  const filteredTransactions = filterTransactions(account.lastStatementDate, transactions);
  dispatch(setSelectedAccount(accountId, filteredTransactions));
};
