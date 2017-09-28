import { combineReducers } from 'redux';
import navigation from './navigation/navigation-reducer';
import userData from './user-data/user-data-reducer';

export default combineReducers({
  navigation,
  userData,
});
