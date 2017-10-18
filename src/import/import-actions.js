import parseOfx from '../ofx/parse-ofx';
import { importStatementData } from './statement/import-statement';

export const STATEMENT_UPLOADED = 'STATEMENT_UPLOADED';
export const statementUploaded = statement => ({
  type: STATEMENT_UPLOADED,
  statement,
});

export const importStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)));

export const IMPORT_ACCOUNT_SELECTED = 'IMPORT_ACCOUNT_SELECTED';
export const importAccountSelected = accountId => ({
  type: IMPORT_ACCOUNT_SELECTED,
  accountId: accountId === '' ? null : accountId,
});

export const RESET_IMPORT = 'RESET_IMPORT';
export const resetImport = () => ({
  type: RESET_IMPORT,
});

export const importStatementToAccount = () => (dispatch, getState) => {
  const statement = getState().statementImport.statement;
  const auth = getState().auth;
  const accountId = getState().statementImport.selectedAccountId;
  dispatch(resetImport());
  return importStatementData(auth, statement, accountId, dispatch, getState);
};
