
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
