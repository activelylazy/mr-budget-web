import { accountReconciles } from '../user-data/user-data-actions';

export const accountNeedsReconcile = (account) => {
  if (account.lastStatementDate === undefined) {
    return false;
  }
  if (account.lastReconcileDate === undefined) {
    return true;
  }
  return account.lastReconcileDate < account.lastStatementDate;
};

export const checkAccountReconciles = (account, dispatch, getState) => {
  if (account.lastStatementDate === undefined) {
    dispatch(accountReconciles(true));
    return Promise.resolve();
  }
  return undefined;
};

export const checkAllAccountsReconcile = (dispatch, getState) => {
  getState().userData.accounts.forEach(account =>
    checkAccountReconciles(account, dispatch, getState));
  return Promise.resolve();
};
