import request from 'request-promise-native';
import { pack, unpack } from '../security/data-packet';

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export function addAccountToState(accountName) {
  return ({
    type: ADD_ACCOUNT,
    accountName,
  });
}

export const USER_DATA_LOADED = 'USER_DATA_LOADED';
export function userDataLoaded(userData) {
  return ({
    type: USER_DATA_LOADED,
    userData,
  });
}

function fetchUserData() {
  console.log('loading user data');
  const options = {
    method: 'GET',
    uri: 'http://localhost:7000/49f6f8b6-5526-452f-9a5e-8af17c7ccf8f/2017/10',
    json: true,
  };
  return request(options)
    .then((response) => {
      console.log(`downloaded ${JSON.stringify(response)}`);
      return unpack(response, 'Password1!');
    });
}

function saveUserData(state) {
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

export const loadUserData = () => (dispatch) => {
  fetchUserData()
    .then(userData => dispatch(userDataLoaded(userData)))
    .catch((err) => {
      console.log(`Error loading user data: ${err}`);
    });
};

export const addAccount = accountName => (dispatch, getState) => {
  dispatch(addAccountToState(accountName));
  saveUserData(getState().accounts);
};
