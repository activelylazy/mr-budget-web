import { onError } from '../app-actions';
import { checkAllAccountsReconcile } from '../reconcile/reconcile';
import { fetchUserData, userDataLoaded } from './user-data-actions';

export const loadUserData = auth => (dispatch, getState) => // eslint-disable-line
  fetchUserData(auth)
    .then(userData => dispatch(userDataLoaded(userData)))
    .then(() => checkAllAccountsReconcile(dispatch, getState))
    .catch(error => onError(dispatch, 'Error loading user data', error));

