import zlib from 'zlib';

export function compress(source) {
  return new Promise((resolve, reject) => {
    zlib.deflate(source, (err, buffer) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

export function uncompress(buffer) {
  return new Promise((resolve, reject) => {
    zlib.inflate(buffer, (err, result) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(result.toString());
      }
    });
  });
}
