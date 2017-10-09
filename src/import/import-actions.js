import parseOfx from '../ofx/parse-ofx';

export const STATEMENT_UPLOADED = 'STATEMENT_UPLOADED';
export const statementUploaded = statement => ({
  type: STATEMENT_UPLOADED,
  statement,
});

export const importStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)));

export const IMPORT_ACCOUNT_SELECTED = 'IMPORT_ACCOUNT_SELECTED';
export const importAccountSelected = accountName => ({
  type: IMPORT_ACCOUNT_SELECTED,
  accountName,
});
