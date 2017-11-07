
export const NAVIGATE = 'NAVIGATE_AREA';
export const changeArea = area => ({
  type: NAVIGATE,
  area,
});

export const NAVIGATE_TO_PERIOD = 'NAVIGATE_TO_PERIOD';
export const navigateToPeriod = (year, month) => ({
  type: NAVIGATE_TO_PERIOD,
  year,
  month,
});

export const NAVIGATE_ACCOUNT = 'NAVIGATE_ACCOUNT';
export const navigateAccount = accountId => ({
  type: NAVIGATE_ACCOUNT,
  accountId,
});
