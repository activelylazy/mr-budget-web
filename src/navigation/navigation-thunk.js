import { loadFinancialDataIfRequired } from '../financial-data/financial-data-actions';
import { navigateToPeriod } from './navigation-actions';

export const loadAndViewFinancialDataForPeriod = (auth, year, month) => (dispatch, getState) => // eslint-disable-line
  loadFinancialDataIfRequired(auth, year, month, dispatch, getState)
    .then(() => dispatch(navigateToPeriod(year, month)));
