import { combineReducers } from 'redux';
import navigation from './navigation/navigation-reducer';
import userData from './user-data/user-data-reducer';
import statementImport from './import/import-reducer';
import financialData from './financial-data/financial-data-reducer';
import auth from './auth/auth-reducer';
import app from './app-reducer';

export default combineReducers({
  auth,
  navigation,
  userData,
  statementImport,
  financialData,
  app,
});
