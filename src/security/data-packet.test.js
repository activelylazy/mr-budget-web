import { assert, should } from 'chai';
import sinon from 'sinon';
import { pack, unpack, __RewireAPI__ as rewireApi } from './data-packet';
import { compress } from './compress';

should();

describe('data packet', () => {
  it('packs and unpacks', (done) => {
    const source = {
      someKey: 'value',
      values: [1, 3, 9, 42],
    };
    const password = 'Password1!';

    pack(source, password)
      .then(packed => unpack(packed, password))
      .then((unpacked) => {
        assert(JSON.stringify(unpacked).should.equal(JSON.stringify(source)));
        done();
      })
      .catch(done.fail);
  });

  it('packs and unpacks dates', (done) => {
    const date = new Date();
    const source = {
      someKey: 'value',
      values: [1, 3, 9, 42],
      date,
    };
    const password = 'Password1!';

    pack(source, password)
      .then(packed => unpack(packed, password))
      .then((unpacked) => {
        assert((typeof (unpacked.date)).should.equal('object'));
        assert(unpacked.date.toISOString().should.equal(date.toISOString()));
        done();
      })
      .catch(done.fail);
  });

  it('size of compressed matches size of encrypted and compressed', (done) => {
    const source = {
      someKey: 'value',
      values: [1, 3, 9, 42],
    };
    const password = 'Password1!';
    const json = JSON.stringify(source);

    compress(json)
      .then((compressed) => {
        pack(source, password)
          .then((packed) => {
            assert(new Buffer(compressed).toString('base64').length.should.equal(packed.base64Bytes.length));
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  describe('pack', () => {
    it('returns result of compressing and encrypting', (done) => {
      const encryptedData = sinon.stub();
      const source = {
        someKey: 'value',
        values: [1, 3, 9, 42],
      };
      const password = 'Password1!';
      const compressStub = sinon.stub().returns(Promise.resolve());
      const encryptUsingPasswordStub = sinon.stub().returns(Promise.resolve(encryptedData));

      rewireApi.__Rewire__('compress', compressStub);
      rewireApi.__Rewire__('encryptUsingPassword', encryptUsingPasswordStub);

      pack(source, password)
        .then((result) => {
          assert(result.should.equal(encryptedData));
          done();
        })
        .catch(done);
    });

    it('rejects if compress rejects', (done) => {
      const error = new Error('error compressing');
      const source = {
        someKey: 'value',
        values: [1, 3, 9, 42],
      };
      const password = 'Password1!';
      const compressStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('compress', compressStub);

      pack(source, password)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });

    it('rejects if encryptUsingPassword rejects', (done) => {
      const error = new Error('error encrypting');
      const source = {
        someKey: 'value',
        values: [1, 3, 9, 42],
      };
      const password = 'Password1!';
      const compressStub = sinon.stub().returns(Promise.resolve());
      const encryptUsingPasswordStub = sinon.stub().returns(Promise.reject(error));

      rewireApi.__Rewire__('compress', compressStub);
      rewireApi.__Rewire__('encryptUsingPassword', encryptUsingPasswordStub);

      pack(source, password)
        .then(() => done(new Error('Expected promise to be rejected')))
        .catch((result) => {
          assert(result.should.equal(error));
          done();
        });
    });
  });
});
