import { BIND_ALERT, SHOW_INFO, SHOW_ERROR } from './app-actions';

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case BIND_ALERT:
      return { alertContainer: action.alertContainer };
    case SHOW_INFO:
      state.alertContainer.show(action.msg, {
        time: 5000,
        type: 'success',
      });
      return state;
    case SHOW_ERROR:
      console.log(`Error: ${action.error}`);
      state.alertContainer.show(action.msg, {
        time: 5000,
        type: 'error',
      });
      return state;
    default:
      return state;
  }
};
