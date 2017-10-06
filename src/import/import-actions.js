import * as types from '../action-types';
import parseOfx from '../ofx/parse-ofx';

export const statementUploaded = statement => ({ // eslint-disable-line
  type: types.STATEMENT_UPLOADED,
  statement,
});

export const importStatement = fileContents => dispatch =>
  parseOfx(fileContents)
    .then(statement => dispatch(statementUploaded(statement)));
