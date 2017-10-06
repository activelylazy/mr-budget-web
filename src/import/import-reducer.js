import Immutable from 'seamless-immutable';
import * as types from '../action-types';

const defaultState = Immutable({
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.STATEMENT_UPLOADED:
      return Immutable({ ...state, statement: action.statement });
    default:
      return state;
  }
};
