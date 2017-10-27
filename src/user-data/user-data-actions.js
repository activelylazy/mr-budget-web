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

export const fetchUserData = (auth) => {
  const options = {
    method: 'GET',
    uri: `${process.env.REACT_APP_SERVER}${auth.userId}`,
    json: true,
  };
  return request(options)
    .then(response => unpack(response, auth.password));
};

export const saveUserData = (auth, state) =>
  pack(state, auth.password)
    .then((packed) => {
      const options = {
        method: 'POST',
        uri: `${process.env.REACT_APP_SERVER}${auth.userId}`,
        body: packed,
        json: true,
      };
      return request(options);
    });

export const UPDATE_LAST_STATEMENT = 'UPDATE_LAST_STATEMENT';
export const updateLastStatement = (statementDate, statementBalance, accountId) => ({
  type: UPDATE_LAST_STATEMENT,
  statementDate,
  statementBalance,
  accountId,
});
