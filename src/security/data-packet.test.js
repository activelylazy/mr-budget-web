import { assert, should } from 'chai';
import { pack, unpack } from './data-packet';
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
});
