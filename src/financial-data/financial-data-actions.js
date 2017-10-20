import request from 'request-promise-native';
import { pack, unpack } from '../security/data-packet';

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
    })
    .catch((err) => {
      console.log(`Error saving financial data: ${err}`);
    });

const emptyMonth = () => ({
  transactions: [],
});

export const loadFinancialData = (auth, year, month) => dispatch =>
  fetchFinancialData(auth, year, month)
    .then(financialData => dispatch(financialDataLoaded(financialData, year, month)))
    .catch((err) => {
      if (err.statusCode === 404) {
        dispatch(financialDataLoaded(emptyMonth(), year, month));
      } else {
        console.log(`Error loading financial data: ${err}`);
      }
    });

export const APPLY_TRANSACTIONS_TO_MONTH = 'APPLY_TRANSACTIONS_TO_MONTH';
export const applyTransactionsToMonth = (year, month, transactions) => ({
  type: APPLY_TRANSACTIONS_TO_MONTH,
  year,
  month,
  transactions,
});
