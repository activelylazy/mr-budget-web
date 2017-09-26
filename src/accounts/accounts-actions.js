import request from 'request-promise-native';

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export function addAccountCompleted(accountName) {
  return ({
    type: ADD_ACCOUNT,
    accountName,
  });
}

export const addAccount = accountName => (dispatch) => {
  // todo: we could dispatch an updating action here

  const body = {
    salt: 'abc123',
    base64Bytes: 'base64Bytes',
  };
  const options = {
    method: 'POST',
    uri: 'http://localhost:7000/49f6f8b6-5526-452f-9a5e-8af17c7ccf8f/2017/10',
    body,
    json: true,
  };
  console.log('sending request...');
  return request(options)
    .then(() => dispatch(addAccountCompleted(accountName)))
    .catch((err) => {
      console.log(`Error adding account: ${err}`);
    });
};
