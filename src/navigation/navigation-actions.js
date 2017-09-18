import * as types from '../action-types';

export const navigateTo = area => ({
  type: types.NAVIGATE,
  area,
});
