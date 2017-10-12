import { assert, should } from 'chai';
import { readFileSync } from 'fs';
import parseOFX from './parse-ofx';

should();

describe('parse ofx', () => {
  it('parses a credit card statement', (done) => {
    const ofxString = readFileSync('test-data/sample-creditcard.ofx').toString();

    parseOFX(ofxString).then((statement) => {
      assert(statement.date.toString().should.equal(new Date(2017, 1, 19).toString()));
      assert(statement.balance.should.equal(-78.99));
      assert(statement.accountId.should.equal('4444333322221111'));
      assert(statement.currency.should.equal('GBP'));
      assert(statement.startDate.toString().should.equal(new Date(2016, 12, 21).toString()));
      assert(statement.endDate.toString().should.equal(new Date(2017, 1, 19).toString()));
      assert(statement.transactions.length.should.equal(2));

      assert(statement.transactions[0].date.toString().should.equal(new Date(2016, 12, 21).toString()));
      assert(statement.transactions[0].amount.should.equal(-12.34));
      assert(statement.transactions[0].id.should.equal('201612211'));
      assert(statement.transactions[0].name.should.equal('MY SHOP'));

      assert(statement.transactions[1].date.toString().should.equal(new Date(2016, 12, 24).toString()));
      assert(statement.transactions[1].amount.should.equal(-66.65));
      assert(statement.transactions[1].id.should.equal('201612242'));
      assert(statement.transactions[1].name.should.equal('A LONG NAME THAT HAS BEEN TRUNCATED'));
      done();
    })
      .catch(done);
  });

  it('parses a bank statement', (done) => {
    const ofxString = readFileSync('test-data/sample-bank1.ofx').toString();

    parseOFX(ofxString).then((statement) => {
      assert(statement.date.toString().should.equal(new Date(2017, 10, 6).toString()));
      assert(statement.balance.should.equal(1010.23));
      assert(statement.accountId.should.equal('44444411111111'));
      assert(statement.currency.should.equal('GBP'));
      assert(statement.startDate.toString().should.equal(new Date(2017, 9, 17).toString()));
      assert(statement.endDate.toString().should.equal(new Date(2017, 10, 7).toString()));
      assert(statement.transactions.length.should.equal(2));

      assert(statement.transactions[0].date.toString().should.equal(new Date(2017, 10, 5).toString()));
      assert(statement.transactions[0].amount.should.equal(-65.00));
      assert(statement.transactions[0].id.should.equal('+201710050000001'));
      assert(statement.transactions[0].name.should.equal('SCOTTISHPOWER 12345678 DDR'));

      assert(statement.transactions[1].date.toString().should.equal(new Date(2017, 10, 4).toString()));
      assert(statement.transactions[1].amount.should.equal(-39.00));
      assert(statement.transactions[1].id.should.equal('+201710040000001'));
      assert(statement.transactions[1].name.should.equal('RADIO TIMES 11011011 DDR'));
      done();
    })
      .catch(done);
  });
});
