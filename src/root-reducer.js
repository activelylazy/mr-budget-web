import { combineReducers } from 'redux';
import navigation from './navigation/navigation-reducer';
import accounts from './accounts/accounts-reducer';

export default combineReducers({
  navigation,
  accounts,
});
