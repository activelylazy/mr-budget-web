import request from 'request-promise-native';
import { pack, unpack } from '../security/data-packet';
import { accountOpeningBalanceInMonth, getStatementMonthsToUpdate } from '../import/statement/statement-actions';
import { findAccountById } from '../accounts/accounts-actions';

export const FINANCIAL_DATA_LOADED = 'FINACIAL_DATA_LOADED';
export function financialDataLoaded(financialData, year, month) {
  return ({
    type: FINANCIAL_DATA_LOADED,
    year,
    month,
    financialData,
  });
}

export const fetchFinancialData = (auth, year, month) => {
  const options = {
    method: 'GET',
    uri: `${process.env.REACT_APP_SERVER}${auth.userId}/${year}/${month}`,
    json: true,
  };
  return request(options)
    .then(response => unpack(response, auth.password));
};

export const saveFinancialData = (auth, state, year, month) =>
  pack(state, auth.password)
    .then((packed) => {
      const options = {
        method: 'POST',
        uri: `${process.env.REACT_APP_SERVER}${auth.userId}/${year}/${month}`,
        body: packed,
        json: true,
      };
      return request(options);
    });

const emptyMonth = (year, month) => ({
  transactions: [],
  year,
  month,
});

export const loadFinancialData = (auth, year, month) =>
  fetchFinancialData(auth, year, month)
    .then(financialData => financialData)
    .catch((err) => {
      if (err.statusCode === 404) {
        return emptyMonth(year, month);
      }
      throw err;
    });

export const loadFinancialDataIfRequired = (auth, year, month, dispatch, getState) => {
  if (getState().financialData[year] === undefined ||
    getState().financialData[year][month] === undefined) {
    return loadFinancialData(auth, year, month, dispatch)
      .then(financialData => dispatch(financialDataLoaded(financialData, year, month)));
  }
  return Promise.resolve();
};

export const loadFinancialDataForMonths = (auth, months, dispatch, getState) =>
  Promise.all(months.map(month =>
    loadFinancialDataIfRequired(auth, month.year, month.month, dispatch, getState)))
    .then(() => months.map(month => getState().financialData[month.year][month.month]));

export const APPLY_TRANSACTIONS_TO_MONTH = 'APPLY_TRANSACTIONS_TO_MONTH';
export const applyTransactionsToMonth = (year, month, transactions) => ({
  type: APPLY_TRANSACTIONS_TO_MONTH,
  year,
  month,
  transactions,
});

export const SET_ACCOUNT_OPENING_BALANCE_IN_MONTH = 'SET_ACCOUNT_OPENING_BALANCE_IN_MONTH';
export const setAccountOpeningBalanceInMonth = (year, month, accountId, openingBalance) => ({
  type: SET_ACCOUNT_OPENING_BALANCE_IN_MONTH,
  year,
  month,
  accountId,
  openingBalance,
});

export const accountTransactionTotals = (account, monthData) =>
  monthData.transactions
    .filter(t => t.accountId === account.id)
    .map(t => t.amount)
    .reduce((a, b) => a + b, 0);

export const getOpeningBalancesForMonths = (months, account) => {
  const results = [];
  let openingBalance = months.length > 0
    ? accountOpeningBalanceInMonth(account, months[0])
    : undefined;

  months.forEach((month) => {
    results.push({
      accountId: account.id,
      year: month.year,
      month: month.month,
      openingBalance,
    });
    openingBalance += accountTransactionTotals(account, month);
  });

  return {
    openingBalances: results,
    closingBalance: openingBalance,
  };
};

export const setOpeningBalances = (openingBalances, dispatch) => {
  openingBalances.forEach(openingBalance =>
    dispatch(setAccountOpeningBalanceInMonth(openingBalance.year,
      openingBalance.month, openingBalance.accountId, openingBalance.openingBalance)));
};

export const updateOpeningBalances = (auth, accountId, statement, dispatch, getState) => {
  const accounts = getState().userData.accounts;
  const account = findAccountById(accounts, accountId);
  const months = getStatementMonthsToUpdate(account, statement);
  return loadFinancialDataForMonths(auth, months, dispatch, getState)
    .then((financialData) => {
      const balances = getOpeningBalancesForMonths(financialData, account);
      setOpeningBalances(balances.openingBalances, dispatch);
    });
};
