import parseOfx from '../ofx/parse-ofx';
import { updateLastStatement } from '../user-data/user-data-actions';
import { importStatementData } from './statement/import-statement';
import { statementUploaded, importStarted, importFinished } from './import-actions';
import { infoAlert, errorAlert } from '../app-actions';

export const readStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)))
    .catch(error => dispatch(errorAlert(`Error uploading statement: ${error}`)));

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

