import Immutable from 'seamless-immutable';
import { FINANCIAL_DATA_LOADED } from './financial-data-actions';

const defaultState = Immutable({
});

function mergeYear(existingYear, month, financialData) {
  return existingYear.set(month, existingYear[month] || financialData);
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case FINANCIAL_DATA_LOADED:
      return state.set(action.year,
        mergeYear(state[action.year] || Immutable({}), action.month, action.financialData));
    default:
      return state;
  }
};
