import { assert, should } from 'chai';
import sinon from 'sinon';
import Immutable from 'seamless-immutable';
import { loadFinancialData, saveFinancialData,
  fetchFinancialData, loadFinancialDataForMonths,
  getOpeningBalancesForMonths, accountTransactionTotals,
  setOpeningBalances, SET_ACCOUNT_OPENING_BALANCE_IN_MONTH,
  updateOpeningBalances,
  __RewireAPI__ as rewireApi } from './financial-data-actions';

should();

describe('financial data', () => {
  let requestStub;
  let unpackStub;
  let packStub;

  beforeEach(() => {
    requestStub = sinon.stub();
    unpackStub = sinon.stub();
    packStub = sinon.stub();
    rewireApi.__Rewire__('unpack', unpackStub);
    rewireApi.__Rewire__('pack', packStub);
    rewireApi.__Rewire__('request', requestStub);
  });

  describe('load financial data', () => {
    it('fetches financial data and returns', (done) => {
      const dispatch = sinon.stub();
      const financialData = { unpackedData: true };
      const auth = sinon.stub();
      const year = 2017;
      const month = 10;
      const fetchFinancialDataStub = sinon.stub().returns(Promise.resolve(financialData));

      rewireApi.__Rewire__('fetchFinancialData', fetchFinancialDataStub);

      loadFinancialData(auth, year, month, dispatch)
        .then((result) => {
          assert(result.should.equal(financialData));
          done();
        })
        .catch(done);
    });

    it('in case results in 404 returns empty financial data', (done) => {
      const dispatch = sinon.stub();
      const errorResponse = {
        statusCode: 404,
      };
      const auth = sinon.stub();
      const year = 2017;
      const month = 10;
      const fetchFinancialDataStub = sinon.stub().returns(Promise.reject(errorResponse));

      rewireApi.__Rewire__('fetchFinancialData', fetchFinancialDataStub);

      loadFinancialData(auth, year, month, dispatch)
        .then((result) => {
          assert(result.transactions.length.should.equal(0));
          assert(result.year.should.equal(2017));
          assert(result.month.should.equal(10));
          done();
        })
        .catch(done);
    });

    it('rejects in case fetchFinancialData is rejected', (done) => {
      const error = sinon.stub();
      const auth = sinon.stub();
      const year = 2017;
      const month = 10;
      const dispatch = sinon.stub();
      const fetchFinancialDataStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('fetchFinancialData', fetchFinancialDataStub);

      loadFinancialData(auth, year, month, dispatch)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('load financial data for months', () => {
    it('loads financial data for multiple months', (done) => {
      const auth = sinon.stub();
      const first = sinon.stub();
      const second = sinon.stub();
      const loadFinancialDataStub = sinon.stub()
        .onFirstCall()
        .returns(Promise.resolve(first))
        .onSecondCall()
        .returns(Promise.resolve(second));

      const months = [
        {
          month: 6,
          year: 2017,
        },
        {
          month: 7,
          year: 2017,
        },
      ];

      rewireApi.__Rewire__('loadFinancialData', loadFinancialDataStub);

      loadFinancialDataForMonths(auth, months)
        .then((result) => {
          assert(loadFinancialDataStub.calledWith(auth, 2017, 6));
          assert(loadFinancialDataStub.calledWith(auth, 2017, 7));
          assert(result.length.should.equal(2));
          assert(result[0].should.equal(first));
          assert(result[1].should.equal(second));
          done();
        })
        .catch(done);
    });
  });

  describe('save financial data', () => {
    it('packs then issues request', (done) => {
      const financialData = { financialData: true };
      const packedData = { packed: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.resolve());

      saveFinancialData(auth, financialData, year, month)
        .then(() => {
          assert(requestStub.calledWith(sinon.match({
            method: 'POST',
            uri: `http://localhost/${auth.userId}/${year}/${month}`,
          })));
          assert(packStub.calledWith(financialData, auth.password));
          done();
        })
        .catch(done);
    });

    it('rejects if pack is rejected', (done) => {
      const error = sinon.stub();
      const financialData = { financialData: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      packStub.returns(Promise.reject(error));

      saveFinancialData(auth, financialData, year, month)
        .then(() => {
          done(new Error('Expected proimse to be rejected'));
        })
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if request is rejected', (done) => {
      const error = sinon.stub();
      const financialData = { financialData: true };
      const packedData = { packed: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.reject(error));

      saveFinancialData(auth, financialData, year, month)
        .then(() => {
          done(new Error('Expected proimse to be rejected'));
        })
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('fetch financial data', () => {
    it('issues request then unpacks', (done) => {
      const packedData = sinon.stub();
      const unpackedData = sinon.stub();
      requestStub.returns(Promise.resolve(packedData));
      unpackStub.returns(Promise.resolve(unpackedData));
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      fetchFinancialData(auth, year, month)
        .then((result) => {
          assert(requestStub.calledWith(sinon.match({
            method: 'GET',
            uri: `http://localhost/${auth.userId}/${year}/${month}`,
          })));
          assert(unpackStub.calledWith(packedData));
          assert(result.should.equal(unpackedData));
          done();
        })
        .catch(done);
    });

    it('rejects if request is rejected', (done) => {
      const error = sinon.stub();
      requestStub.returns(Promise.reject(error));

      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      fetchFinancialData(auth, year, month)
        .then(() => {
          done(new Error('Unexpected success'));
        })
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if unpack is rejected', (done) => {
      const error = sinon.stub();
      const packedData = sinon.stub();
      requestStub.returns(Promise.resolve(packedData));
      unpackStub.returns(Promise.reject(error));

      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const year = 2017;
      const month = 10;

      fetchFinancialData(auth, year, month)
        .then(() => {
          done(new Error('Unexpected success'));
        })
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('get opening balances for months', () => {
    it('returns empty for empty list of months', () => {
      const months = [];
      const accountId = 'abc-123';

      const result = getOpeningBalancesForMonths(months, accountId);

      assert(result.openingBalances.length.should.equal(0));
      assert.isUndefined(result.closingBalance);
    });

    it('returns opening balance for one month', () => {
      const monthData = {
        year: 2017,
        month: 7,
      };
      const months = [monthData];
      const accountId = 'abc-123';
      const account = {
        id: accountId,
      };
      const accountOpeningBalanceInMonthStub = sinon.stub().returns(123.45);
      const accountTransactionTotalsStub = sinon.stub().returns(100.11);

      rewireApi.__Rewire__('accountOpeningBalanceInMonth', accountOpeningBalanceInMonthStub);
      rewireApi.__Rewire__('accountTransactionTotals', accountTransactionTotalsStub);

      const result = getOpeningBalancesForMonths(months, account);

      assert(accountOpeningBalanceInMonthStub.calledWith(account, monthData));
      assert(result.openingBalances.length.should.equal(1));
      assert(result.openingBalances[0].accountId.should.equal(accountId));
      assert(result.openingBalances[0].year.should.equal(2017));
      assert(result.openingBalances[0].month.should.equal(7));
      assert(result.openingBalances[0].openingBalance.should.equal(123.45));
      assert(result.closingBalance.should.equal(223.56));
    });

    it('returns opening balance for two months', () => {
      const monthData1 = {
        year: 2017,
        month: 7,
      };
      const monthData2 = {
        year: 2017,
        month: 8,
      };
      const months = [monthData1, monthData2];
      const accountId = 'abc-123';
      const account = {
        id: accountId,
      };
      const accountOpeningBalanceInMonthStub = sinon.stub().returns(123.45);
      const accountTransactionTotalsStub = sinon.stub()
        .onFirstCall()
        .returns(100.11)
        .onSecondCall()
        .returns(-22.50);

      rewireApi.__Rewire__('accountOpeningBalanceInMonth', accountOpeningBalanceInMonthStub);
      rewireApi.__Rewire__('accountTransactionTotals', accountTransactionTotalsStub);

      const result = getOpeningBalancesForMonths(months, account);

      assert(accountOpeningBalanceInMonthStub.calledWith(account, monthData1));
      assert(accountTransactionTotalsStub.calledWith(account, monthData2));
      assert(result.openingBalances.length.should.equal(2));

      assert(result.openingBalances[0].accountId.should.equal(accountId));
      assert(result.openingBalances[0].year.should.equal(2017));
      assert(result.openingBalances[0].month.should.equal(7));
      assert(result.openingBalances[0].openingBalance.should.equal(123.45));

      assert(result.openingBalances[1].accountId.should.equal(accountId));
      assert(result.openingBalances[1].year.should.equal(2017));
      assert(result.openingBalances[1].month.should.equal(8));
      assert(result.openingBalances[1].openingBalance.should.equal(223.56));

      assert(result.closingBalance.should.equal(201.06));
    });
  });

  describe('account transaction totals', () => {
    it('returns zero for empty transaction list', () => {
      const account = {
        id: 'abc-123',
      };
      const monthData = {
        transactions: [],
      };
      const result = accountTransactionTotals(account, monthData);

      assert(result.should.equal(0));
    });

    it('returns total of matching transactions in list', () => {
      const account = {
        id: 'abc-123',
      };
      const monthData = {
        transactions: [
          {
            amount: 10,
            accountId: 'abc-123',
          },
          {
            amount: 20,
            accountId: 'another',
          },
          {
            amount: 30,
            accountId: 'abc-123',
          },
        ],
      };
      const result = accountTransactionTotals(account, monthData);

      assert(result.should.equal(40));
    });
  });

  describe('set opening balances', () => {
    it('dispatches set opening balance for each month', () => {
      const openingBalances = [
        {
          accountId: 'abc-123',
          year: 2017,
          month: 6,
          openingBalance: 111.11,
        },
      ];
      const dispatch = sinon.stub();

      setOpeningBalances(openingBalances, dispatch);

      assert(dispatch.calledWith(sinon.match({
        type: SET_ACCOUNT_OPENING_BALANCE_IN_MONTH,
        accountId: 'abc-123',
        year: 2017,
        month: 6,
        openingBalance: 111.11,
      })));
    });
  });

  describe('update opening balances', () => {
    it('fetches account by id', (done) => {
      const account = sinon.stub();
      const findAccountById = sinon.stub().returns(account);
      const auth = sinon.stub();
      const accountId = sinon.stub();
      const statement = sinon.stub();
      const dispatch = sinon.stub();
      const accounts = sinon.stub();
      const getState = sinon.stub().returns(Immutable({
        userData: {
          accounts,
        },
      }));

      rewireApi.__Rewire__('findAccountById', findAccountById);

      updateOpeningBalances(auth, accountId, statement, dispatch, getState)
        .then(() => {
          assert(findAccountById.calledWith(accounts, accountId));
          done();
        })
        .catch(done);
    });
  });
});
