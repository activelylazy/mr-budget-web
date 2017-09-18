import * as types from '../action-types';

export const navigateTo = area => ({ // eslint-disable-line
  type: types.NAVIGATE,
  area,
});
