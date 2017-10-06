import parseOfx from '../ofx/parse-ofx';

export const STATEMENT_UPLOADED = 'STATEMENT_UPLOADED';
export const statementUploaded = statement => ({ // eslint-disable-line
  type: STATEMENT_UPLOADED,
  statement,
});

export const importStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)));
