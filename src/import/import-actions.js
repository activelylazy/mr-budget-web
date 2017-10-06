import * as types from '../action-types';

export const importStatement = contents => ({ // eslint-disable-line
  type: types.IMPORT_STATEMENT,
  contents,
});

