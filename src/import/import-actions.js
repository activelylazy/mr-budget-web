import parseOfx from '../ofx/parse-ofx';
import splitStatement from './statement/split-statement';
import { saveFinancialData } from '../financial-data/financial-data-actions';
import { loadFinancialDataAndApplyTransactions } from './statement/import-statement';

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
  return new Promise((resolve, reject) => {
    const splits = splitStatement(statement);
    const promises = splits.map(split =>
      loadFinancialDataAndApplyTransactions(auth, split)(dispatch, getState)
        .then(monthData => saveFinancialData(auth, monthData, split.year, split.month)));
    Promise.all(promises).then(() => resolve()).catch(reject);
  });
};
