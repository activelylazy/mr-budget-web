
function findSplit(splits, date) {
  return splits.find(split => split.year === date.getFullYear() && split.month === date.getMonth());
}

export default (statement) => {
  const splits = [];
  statement.transactions.forEach((transaction) => {
    const split = findSplit(splits, transaction.date);
    if (split === undefined) {
      splits.push({
        year: transaction.date.getFullYear(),
        month: transaction.date.getMonth(),
        transactions: [transaction],
      });
    } else {
      split.transactions.push(transaction);
    }
  });
  return splits;
};
