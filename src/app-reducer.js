import { BIND_ALERT } from './app-actions';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case BIND_ALERT:
      return { alertContainer: action.alertContainer };
    default:
      return state;
  }
};
