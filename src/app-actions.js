
export const BIND_ALERT = 'BIND_ALERT';
export const onBindAlert = alertContainer => ({
  type: BIND_ALERT,
  alertContainer,
});

export const infoAlert = msg => (dispatch, getState) => {
  getState().app.alertContainer.show(msg, {
    time: 5000,
    type: 'success',
  });
};
