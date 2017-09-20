import { assert, should } from 'chai';
import navigationReducer from './navigation-reducer';
import * as areas from './navigation-areas';
import * as actions from './navigation-actions';

should();

describe('navigation reducer', () => {
  it('selected area is accounts by default', () => {
    const state = navigationReducer(undefined, {});
    assert(state.area.should.equal(areas.ACCOUNTS));
  });

  it('should select a different area', () => {
    const state = navigationReducer(undefined, actions.changeArea(areas.CATEGORIES));
    assert(state.area.should.equal(areas.CATEGORIES));
  });
});