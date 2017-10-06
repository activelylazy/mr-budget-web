import Immutable from 'seamless-immutable';
import { NAVIGATE } from './navigation-actions';
import * as areas from './navigation-areas';

const defaultState = Immutable({
  area: areas.ACCOUNTS,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case NAVIGATE:
      return Immutable({ ...state, area: action.area });
    default:
      return state;
  }
};
