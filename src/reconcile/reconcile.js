
export const accountNeedsReconcile = (account) => {
  if (account.lastReconcileDate === undefined) {
    return true;
  }
  return account.lastReconcileDate < account.lastStatementDate;
};

export const checkAccountReconciles = (account, dispatch, getState) => undefined;

export const checkAllAccountsReconcile = (dispatch, getState) => {
  getState().userData.accounts.forEach(account =>
    checkAccountReconciles(account, dispatch, getState));
  return Promise.resolve();
};
