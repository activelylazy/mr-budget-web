import Immutable from 'seamless-immutable';
import * as types from '../action-types';
import * as areas from './navigation-areas';

const defaultState = Immutable({
  area: areas.ACCOUNTS,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.NAVIGATE:
      return Immutable({ ...state, area: action.area });
    default:
      return state;
  }
};
