import parseOfx from '../ofx/parse-ofx';
import splitStatement from './statement/split-statement';
import { loadFinancialData, applyTransactionsToMonth,
  saveFinancialData } from '../financial-data/financial-data-actions';

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

export const importStatementToAccount = (auth, accountId, statement) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const splits = splitStatement(statement);
    const promises = splits.map(split =>
      loadFinancialData(auth, split.year, split.month)(dispatch)
        .then(() => dispatch(applyTransactionsToMonth(split.year,
          split.month, split.transactions)))
        .then(() => saveFinancialData(auth, getState().financialData[split.year][split.month], split.year, split.month)));
    Promise.all(promises).then(() => resolve()).catch(reject);
  });
