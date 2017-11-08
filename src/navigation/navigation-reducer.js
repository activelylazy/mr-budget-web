import Immutable from 'seamless-immutable';
import { NAVIGATE, NAVIGATE_TO_PERIOD, NAVIGATE_ACCOUNT } from './navigation-actions';
import * as areas from './navigation-areas';

const defaultState = Immutable({
  area: areas.ACCOUNTS,
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case NAVIGATE:
      return Immutable({ ...state, area: action.area });
    case NAVIGATE_TO_PERIOD:
      return Immutable({
        ...state,
        currentMonth: action.month,
        currentYear: action.year,
      });
    case NAVIGATE_ACCOUNT:
      return Immutable({
        ...state,
        selectedAccountId: action.accountId,
      });
    default:
      return state;
  }
};
