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

function fetchFinancialData(auth, year, month) {
  const options = {
    uri: `${process.env.REACT_APP_SERVER}${auth.userId}/${year}/${month}`,
    json: true,
  };
  return request.get(options)
    .then(response => unpack(response, auth.password));
}

export const loadFinancialData = (auth, year, month) => dispatch =>
  fetchFinancialData(auth, year, month)
    .then(userData => dispatch(financialDataLoaded(userData, year, month)))
    .catch((err) => {
      console.log(`Error loading financial data: ${err}`);
    });
