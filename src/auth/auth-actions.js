export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export function userLoggedIn(userId, password) {
  return ({
    type: USER_LOGGED_IN,
    userId,
    password,
  });
}
