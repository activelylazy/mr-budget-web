import { combineReducers } from 'redux';
import navigation from './navigation/navigation-reducer';
import userData from './user-data/user-data-reducer';
import statementImport from './import/import-reducer';
import financialData from './financial-data/financial-data-reducer';

export default combineReducers({
  navigation,
  userData,
  statementImport,
  financialData,
});
