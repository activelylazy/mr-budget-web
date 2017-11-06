import Immutable from 'seamless-immutable';
import { parse as parseOFX } from './ofx';

function readDate(input) {
  const year = input.substring(0, 4);
  const month = input.substring(4, 6) - 1;
  const day = input.substring(6, 8);
  return new Date(year, month, day);
}

function nameAndMemo(transaction) {
  if (transaction.MEMO === undefined) {
    return transaction.NAME;
  }
  if (transaction.NAME === undefined) {
    return transaction.MEMO;
  }
  if (transaction.MEMO.startsWith(transaction.NAME)) {
    return transaction.MEMO;
  }
  return `${transaction.NAME.trim()} - ${transaction.MEMO.trim()}`;
}

function createTransaction(transaction) {
  return {
    date: readDate(transaction.DTPOSTED.toString()),
    amount: parseFloat(transaction.TRNAMT),
    id: transaction.FITID,
    name: nameAndMemo(transaction),
  };
}

function createBankStatement(ofxContents) {
  const stmt = ofxContents.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
  return Immutable.from({
    date: readDate(stmt.LEDGERBAL.DTASOF.toString()),
    balance: parseFloat(stmt.LEDGERBAL.BALAMT),
    accountId: stmt.BANKACCTFROM.ACCTID.toString(),
    currency: stmt.CURDEF.toString(),
    startDate: readDate(stmt.BANKTRANLIST.DTSTART.toString()),
    endDate: readDate(stmt.BANKTRANLIST.DTEND.toString()),
    transactions: stmt.BANKTRANLIST.STMTTRN.map(createTransaction),
  });
}

function createCreditCardStatement(ofxContents) {
  const creditCardStmt = ofxContents.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS;
  return Immutable.from({
    date: readDate(creditCardStmt.LEDGERBAL.DTASOF.toString()),
    balance: parseFloat(creditCardStmt.LEDGERBAL.BALAMT),
    accountId: creditCardStmt.CCACCTFROM.ACCTID.toString(),
    currency: creditCardStmt.CURDEF.toString(),
    startDate: readDate(creditCardStmt.BANKTRANLIST.DTSTART.toString()),
    endDate: readDate(creditCardStmt.BANKTRANLIST.DTEND.toString()),
    transactions: creditCardStmt.BANKTRANLIST.STMTTRN.map(createTransaction),
  });
}

function createStatement(ofxContents) {
  if (ofxContents.OFX.CREDITCARDMSGSRSV1 !== undefined) {
    return createCreditCardStatement(ofxContents);
  }
  return createBankStatement(ofxContents);
}

export default contents => parseOFX(contents).then(createStatement);
