
export const BIND_ALERT = 'BIND_ALERT';
export const onBindAlert = alertContainer => ({
  type: BIND_ALERT,
  alertContainer,
});

export const SHOW_INFO = 'SHOW_INFO';
export const infoAlert = msg => ({
  type: SHOW_INFO,
  msg,
});

export const SHOW_ERROR = 'SHOW_ERROR';
export const errorAlert = (msg, error) => ({
  type: SHOW_ERROR,
  msg,
  error,
});

export const onError = (dispatch, msg, error) => {
  dispatch(errorAlert(msg, error));
  if (process.env.NODE_ENV !== 'test') {
    throw error;
  }
};
