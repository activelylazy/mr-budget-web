import Immutable from 'seamless-immutable';
import { USER_LOGGED_IN } from './auth-actions';

const defaultState = Immutable({
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return ({
        userId: action.userId,
        password: action.password,
      });
    default:
      return state;
  }
};
