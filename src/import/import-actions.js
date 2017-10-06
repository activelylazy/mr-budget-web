import * as types from '../action-types';

export const uploadStatement = statement => ({ // eslint-disable-line
  type: types.UPLOAD_STATEMENT,
  statement,
});

