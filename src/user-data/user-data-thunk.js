import { onError } from '../app-actions';
import { checkAllAccountsReconcile } from '../reconcile/reconcile';
import { fetchUserData, userDataLoaded } from './user-data-actions';

export const loadUserData = auth => (dispatch, getState) => // eslint-disable-line
  fetchUserData(auth)
    .then(userData => checkAllAccountsReconcile(dispatch, getState).then(() => userData))
    .then(userData => dispatch(userDataLoaded(userData)))
    .catch(error => onError(dispatch, 'Error loading user data', error));

