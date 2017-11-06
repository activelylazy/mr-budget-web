import { saveUserData, addAccountToState } from '../user-data/user-data-actions';
import { onError } from '../app-actions';

export const addAccount = (auth, accountName) => (dispatch, getState) => // eslint-disable-line
  saveUserData(auth, getState().userData)
    .then(() => dispatch(addAccountToState(accountName)))
    .catch(error => onError(dispatch, 'Error adding account', error));

