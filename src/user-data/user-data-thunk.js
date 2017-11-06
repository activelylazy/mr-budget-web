import { onError } from '../app-actions';
import { fetchUserData, userDataLoaded } from './user-data-actions';

export const loadUserData = auth => dispatch => // eslint-disable-line
  fetchUserData(auth)
    .then(userData => dispatch(userDataLoaded(userData)))
    .catch(error => onError(dispatch, 'Error loading user data', error));

