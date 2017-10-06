import Immutable from 'seamless-immutable';
import { parse as parseOFX } from './ofx';

function readDate(input) {
  const year = input.substring(0, 4);
  const month = input.substring(4, 6);
  const day = input.substring(6, 8);
  return new Date(year, month, day);
}

function createTransaction(transaction) {
  return {
    date: readDate(transaction.DTPOSTED.toString()),
    amount: parseFloat(transaction.TRNAMT),
    id: transaction.FITID,
    name: transaction.MEMO || transaction.NAME,
  };
}

function createStatement(ofxContents) {
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

export default contents => parseOFX(contents).then(createStatement);
