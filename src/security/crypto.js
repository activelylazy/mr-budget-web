import crypto from 'crypto-browserify';
import aesjs from 'aes-js';

const iterationCount = 100000;
// key generation & encrypting test data times:
//     50,000 =>  75   ms
//    100,000 => 150   ms
//    500,000 =>   1   sec
//  1,000,000 =>   1.5 sec

export function encryptUsingPassword(text, password) {
  return new Promise((resolve, reject) => {
    const salt = new Buffer(crypto.randomBytes(32)).toString('base64');
    crypto.pbkdf2(password, salt, iterationCount, 32, 'sha512', (err, key) => {
      if (err !== undefined && err !== null) {
        reject(err);
        return;
      }

      const aesCtr = new aesjs.ModeOfOperation.ctr(key); // eslint-disable-line
      const encryptedBytes = aesCtr.encrypt(new Buffer(text));

      const base64Bytes = new Buffer(encryptedBytes).toString('base64');

      resolve({
        base64Bytes,
        salt,
      });
    });
  });
}

export function decryptUsingPassword(payload, password) {
  return new Promise((resolve, reject) => {
    const { base64Bytes, salt } = payload;
    const encryptedBytes = new Buffer(base64Bytes, 'base64');
    crypto.pbkdf2(password, salt, iterationCount, 32, 'sha512', (err, key) => {
      if (err !== undefined && err !== null) {
        reject(err);
        return;
      }
      const aesCtr = new aesjs.ModeOfOperation.ctr(key); // eslint-disable-line
      const decryptedBytes = aesCtr.decrypt(encryptedBytes);

      resolve(new Buffer(decryptedBytes));
    });
  });
}

export function encryptUsingPrivateKey(text, privateKey) {
  const buff = Buffer.from(text);
  return crypto.privateEncrypt(privateKey, buff);
}

export function decryptUsingPublicKey(encrypted, publicKey) {
  return crypto.publicDecrypt(publicKey, encrypted).toString();
}
