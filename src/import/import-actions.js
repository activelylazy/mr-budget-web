import * as types from '../action-types';

export const statementUploaded = statement => ({ // eslint-disable-line
  type: types.STATEMENT_UPLOADED,
  statement,
});

