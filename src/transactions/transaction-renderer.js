
export const transactionsForAccount = (monthData, accountId) => // eslint-disable-line
  monthData.transactions
    .filter(t => t.accountId === accountId)
    .sort(t => t.date);
