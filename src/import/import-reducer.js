import Immutable from 'seamless-immutable';
import { STATEMENT_UPLOADED } from './import-actions';

const defaultState = Immutable({
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case STATEMENT_UPLOADED:
      return Immutable({ ...state, statement: action.statement });
    default:
      return state;
  }
};
