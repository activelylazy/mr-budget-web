import * as types from '../action-types';

export const uploadStatement = contents => ({ // eslint-disable-line
  type: types.UPLOAD_STATEMENT,
  contents,
});

