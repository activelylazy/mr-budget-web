
export const checkAccountNeedsReconcile = (account, dispatch, getState) => undefined;

export const checkAllAccountsNeedReconcile = (dispatch, getState) => {
  getState().userData.accounts.forEach(account =>
    checkAccountNeedsReconcile(account, dispatch, getState));
  return Promise.resolve();
};
