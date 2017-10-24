
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
