import { assert, should } from 'chai';
import { compress, uncompress } from './compress';

should();

describe('compression', () => {
  it('should compress and uncompress data', (done) => {
    const source = 'some text with some words and some reptition to see how well we can compress some text';

    compress(source)
      .then(buffer => uncompress(buffer))
      .then((result) => {
        assert(result.toString().should.equal(source));
        done();
      })
      .catch(done.fail);
  });
});
