
export const STATEMENT_UPLOADED = 'STATEMENT_UPLOADED';
export const statementUploaded = statement => ({
  type: STATEMENT_UPLOADED,
  statement,
});

export const filterTransactions = (lastStatementDate, transactions) => {
  if (lastStatementDate === undefined) {
    return transactions;
  }
  return transactions.filter(t => t.date > lastStatementDate);
};

export const IMPORT_ACCOUNT_SELECTED = 'IMPORT_ACCOUNT_SELECTED';
export const setSelectedAccount = (accountId, filteredTransactions) => ({
  type: IMPORT_ACCOUNT_SELECTED,
  accountId: accountId === '' ? null : accountId,
  filteredTransactions,
});

export const IMPORT_STARTED = 'IMPORT_STARTED';
export const importStarted = () => ({
  type: IMPORT_STARTED,
});

export const IMPORT_FINISHED = 'IMPORT_FINISHED';
export const importFinished = () => ({
  type: IMPORT_FINISHED,
});

