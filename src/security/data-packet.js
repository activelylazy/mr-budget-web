import { compress, uncompress } from './compress';
import { encryptUsingPassword, decryptUsingPassword } from './crypto';

export function pack(source, password) {
  return compress(JSON.stringify(source))
    .then(compressed => encryptUsingPassword(compressed, password));
}

export function unpack(packed, password) {
  return decryptUsingPassword(packed, password)
    .then(decrypted => uncompress(decrypted))
    .then(JSON.parse);
}
