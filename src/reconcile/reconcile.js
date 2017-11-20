import { accountReconciles } from '../user-data/user-data-actions';
import { loadFinancialDataIfRequired, accountTransactionTotals } from '../financial-data/financial-data-actions';

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
    dispatch(accountReconciles(account.id, true));
    return Promise.resolve();
  }
  const year = account.lastStatementDate.getFullYear();
  const month = account.lastStatementDate.getMonth();
  const auth = getState().auth;
  return loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
    .then(() => {
      const monthData = getState().financialData[year][month];
      const openingBalance = monthData.openingBalances[account.id];
      const calculatedBalance = openingBalance + accountTransactionTotals(account, monthData);
      dispatch(accountReconciles(account.id, calculatedBalance === account.lastStatementBalance));
    });
};

export const checkAllAccountsReconcile = (dispatch, getState) => {
  getState().userData.accounts.forEach(account =>
    checkAccountReconciles(account, dispatch, getState));
  return Promise.resolve();
};
