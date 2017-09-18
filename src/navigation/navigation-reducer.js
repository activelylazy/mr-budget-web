import { fromJS } from 'immutable';
import * as types from '../action-types';
import * as areas from './navigation-areas';

const defaultState = fromJS({
  area: areas.ACCOUNTS,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.NAVIGATE:
      return state.set('area', action.area);
    default:
      return state;
  }
};
