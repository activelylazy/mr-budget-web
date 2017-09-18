import { assert, should } from 'chai';
import { fromJS } from 'immutable';
import navigationReducer from './navigation-reducer';
import * as areas from './navigation-areas';
import * as actions from './navigation-actions';

should();

describe('navigation reducer', () => {
  it('selected area is accounts by default', () => {
    const state = navigationReducer(undefined, {});
    assert(state.get('area').should.equal(areas.ACCOUNTS));
  });

  it('should select a different area', () => {
    const state = navigationReducer(undefined, actions.navigateTo(areas.CATEGORIES));
    assert(state.get('area').should.equal(areas.CATEGORIES));
  });
});
