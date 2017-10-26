import { assert, should } from 'chai';
import sinon from 'sinon';
import { SHOW_ERROR } from '../app-actions';
import { STATEMENT_UPLOADED } from './import-actions';
import { readStatement, __RewireAPI__ as rewireApi } from './import-thunk';

should();

describe('import thunk', () => {
  describe('read statement', () => {
    it('parses and dispatches statement_uploaded', (done) => {
      const fileContents = 'file contents';
      const parseOfx = sinon.stub();
      const statement = sinon.stub();
      const dispatch = sinon.stub();

      rewireApi.__Rewire__('parseOfx', parseOfx);
      parseOfx.returns(Promise.resolve(statement));

      readStatement(fileContents)(dispatch)
        .then(() => {
          assert(parseOfx.calledWith(fileContents));
          assert(dispatch.calledWith(sinon.match({
            type: STATEMENT_UPLOADED,
            statement,
          })));
          done();
        })
        .catch(done);
    });

    it('dispatches error alert if parseOfx is rejected', (done) => {
      const error = new Error('testing');
      const fileContents = 'file contents';
      const parseOfx = sinon.stub();
      const dispatch = sinon.stub();

      rewireApi.__Rewire__('parseOfx', parseOfx);
      parseOfx.returns(Promise.reject(error));

      readStatement(fileContents)(dispatch)
        .then(() => {
          assert(dispatch.calledWith(sinon.match({
            type: SHOW_ERROR,
            msg: 'Error uploading statement: Error: testing',
          })));
          done();
        });
    });
  });
});
