import { saveUserData, addAccountToState } from '../user-data/user-data-actions';
import { onError } from '../app-actions';
import { navigateToPeriod, navigateAccount } from '../navigation/navigation-actions';
import { loadFinancialDataIfRequired } from '../financial-data/financial-data-actions';

export const addAccount = (auth, accountName) => (dispatch, getState) =>
  saveUserData(auth, getState().userData)
    .then(() => dispatch(addAccountToState(accountName)))
    .catch(error => onError(dispatch, 'Error adding account', error));

export const viewAccountTransactions = accountId => (dispatch, getState) => {
  const auth = getState().auth;
  if (getState().navigation.currentMonth === undefined &&
    getState().navigation.currrentYear === undefined) {
    const account = getState().userData.accounts.find(a => a.id === accountId);
    dispatch(navigateToPeriod(account.lastStatementDate.getFullYear(),
      account.lastStatementDate.getMonth() - 1));
    dispatch(navigateAccount(accountId));
    return loadFinancialDataIfRequired(auth, account.lastStatementDate.getFullYear(),
      account.lastStatementDate.getMonth() - 1, dispatch, getState);
  }
  return Promise.resolve();
};
