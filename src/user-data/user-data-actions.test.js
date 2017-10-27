import { assert, should } from 'chai';
import sinon from 'sinon';
import { fetchUserData, saveUserData,
  updateLastStatement, UPDATE_LAST_STATEMENT,
  __RewireAPI__ as rewireApi } from './user-data-actions';

should();

describe('user data', () => {
  let requestStub;
  let unpackStub;
  let packStub;

  beforeEach(() => {
    requestStub = sinon.stub();
    unpackStub = sinon.stub();
    packStub = sinon.stub();
    rewireApi.__Rewire__('request', requestStub);
    rewireApi.__Rewire__('unpack', unpackStub);
    rewireApi.__Rewire__('pack', packStub);
  });

  describe('fetch user data', () => {
    it('issues request then unpacks', (done) => {
      const response = '{response: true}';
      const userData = { unpackedData: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      requestStub.returns(Promise.resolve(response));
      unpackStub.returns(Promise.resolve(userData));

      fetchUserData(auth)
        .then(() => {
          assert(requestStub.calledWith(sinon.match({
            method: 'GET',
            uri: `http://localhost/${auth.userId}`,
          })));
          assert(unpackStub.calledWith(response, auth.password));
          done();
        })
        .catch(done);
    });

    it('rejects if request is rejected', (done) => {
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      requestStub.returns(Promise.reject(error));

      fetchUserData(auth)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if unpack is rejected', (done) => {
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };
      const response = '{response: true}';

      requestStub.returns(Promise.resolve(response));
      unpackStub.returns(Promise.reject(error));

      fetchUserData(auth)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('save user data', () => {
    it('packs then issues request', (done) => {
      const userData = { userData: true };
      const packedData = { packed: true };
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.resolve());

      saveUserData(auth, userData)
        .then(() => {
          assert(requestStub.calledWith(sinon.match({
            method: 'POST',
            uri: `http://localhost/${auth.userId}`,
          })));
          assert(packStub.calledWith(userData, auth.password));
          done();
        })
        .catch(done);
    });

    it('rejects if pack is rejected', (done) => {
      const userData = { userData: true };
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.reject(error));

      saveUserData(auth, userData)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if request is rejected', (done) => {
      const userData = { userData: true };
      const packedData = { packedData: true };
      const error = sinon.stub();
      const auth = {
        userId: '49f6f8b6-5526-452f-9a5e-8af17c7ccf8e',
        password: 'my password',
      };

      packStub.returns(Promise.resolve(packedData));
      requestStub.returns(Promise.reject(error));

      saveUserData(auth, userData)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });

  describe('update last statement', () => {
    it('creates update last statement action', () => {
      const statementDate = sinon.stub();
      const statementBalance = sinon.stub();
      const accountId = sinon.stub();

      const result = updateLastStatement(statementDate, statementBalance, accountId);

      assert(result.type.should.equal(UPDATE_LAST_STATEMENT));
      assert(result.statementDate.should.equal(statementDate));
      assert(result.statementBalance.should.equal(statementBalance));
      assert(result.accountId.should.equal(accountId));
    });
  });
});
