import Immutable from 'seamless-immutable';

export const transactionsForAccount = (monthData, accountId) => { // eslint-disable-line
  const array = monthData.transactions
    .filter(t => t.accountId === accountId)
    .asMutable();
  array.sort((a, b) => a.date.getTime() - b.date.getTime());
  return Immutable(array);
};
