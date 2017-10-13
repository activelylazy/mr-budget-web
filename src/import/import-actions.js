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
export const importAccountSelected = accountId => ({
  type: IMPORT_ACCOUNT_SELECTED,
  accountId: accountId === '' ? null : accountId,
});

export const RESET_IMPORT = 'RESET_IMPORT';
export const resetImport = () => ({
  type: RESET_IMPORT,
});

export const IMPORT_STATEMENT_TO_ACCOUNT = 'IMPORT_STATEMENT_TO_ACCOUNT';
export const importStatementToAccount = (accountId, statement) => ({
  type: IMPORT_STATEMENT_TO_ACCOUNT,
  accountId,
  statement,
});
