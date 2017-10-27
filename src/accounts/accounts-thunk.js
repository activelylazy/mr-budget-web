import { saveUserData, addAccountToState } from '../user-data/user-data-actions';
import { errorAlert } from '../app-actions';

export const addAccount = (auth, accountName) => (dispatch, getState) => // eslint-disable-line
  saveUserData(auth, getState().userData)
    .then(() => dispatch(addAccountToState(accountName)))
    .catch(error => dispatch(errorAlert(`Error adding account: ${error}`)));

