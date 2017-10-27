import { errorAlert } from '../app-actions';
import { fetchUserData, userDataLoaded } from './user-data-actions';

export const loadUserData = auth => dispatch => // eslint-disable-line
  fetchUserData(auth)
    .then(userData => dispatch(userDataLoaded(userData)))
    .catch(error => dispatch(errorAlert(`Error loading user data: ${error}`)));

