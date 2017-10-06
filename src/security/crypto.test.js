import { assert, should } from 'chai';
import { encryptUsingPassword, decryptUsingPassword } from './crypto';

should();

describe('crypto web', () => {
  it('encrypts and decrypts using a password', (done) => {
    const secret = new Buffer('super secret data');
    const password = 'Password1!';
    encryptUsingPassword(secret, password)
      .then(encrypted => decryptUsingPassword(encrypted, password))
      .then((decrypted) => {
        assert(decrypted.toString('utf8').should.equal(secret.toString('utf8')));
        done();
      })
      .catch(done.fail);
  });

  it('encrypts and decrypts binary data using a password', (done) => {
    const secret = new Buffer('eJyrVirOz031Tq1UslIqS8wpTVXSgdDFSlbRhjrGOpY6JkaxtQADhwwu', 'base64');
    const password = 'Password1!';
    encryptUsingPassword(secret, password)
      .then(encrypted => decryptUsingPassword(encrypted, password))
      .then((decrypted) => {
        assert(decrypted.toString('base64').should.equal(secret.toString('base64')));
        done();
      })
      .catch(done.fail);
  });

  it('times encryption', (done) => {
    const startTime = process.hrtime();
    const secret = 'super secret data';
    const password = 'Password1!';
    encryptUsingPassword(secret, password)
      .then(() => {
        const elapsed = process.hrtime(startTime);
        assert(elapsed[0].should.equal(0));
        assert(elapsed[1].should.be.lessThan(500000000)); // 500ms
        done();
      })
      .catch(done.fail);
  });
});
