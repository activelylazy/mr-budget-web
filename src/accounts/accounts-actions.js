import request from 'request-promise-native';
import { pack } from '../security/data-packet';

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export function addAccountToState(accountName) {
  return ({
    type: ADD_ACCOUNT,
    accountName,
  });
}

function saveUserData(state) {
  // const body = {
  //   salt: 'abc123',
  //   base64Bytes: 'base64Bytes',
  // };
  console.log(`saving state ${JSON.stringify(state)}`);
  pack(state, 'Password1!')
    .then((packed) => {
      const options = {
        method: 'POST',
        uri: 'http://localhost:7000/49f6f8b6-5526-452f-9a5e-8af17c7ccf8f/2017/10',
        body: packed,
        json: true,
      };
      return request(options);
    })
    .then(() => console.log('state saved'))
    .catch((err) => {
      console.log(`Error adding account: ${err}`);
    });
}

export const addAccount = accountName => (dispatch, getState) => {
  dispatch(addAccountToState(accountName));
  saveUserData(getState().accounts);
};
