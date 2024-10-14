import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import ERROR_MESSAGES from './constants/errors.mjs';
import { basename, dirname, resolve } from 'path';
import VALIDATION_TYPES from './constants/validations.mjs';
import validate from './handlers/validation.mjs';

const handleCompression = async (path, { command, params }) => {
  switch (command) {
    case 'compress':
      return await compress(path, ...params);
    case 'decompress':
      return await decompress(path, ...params);
    default:
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
};

const compress = async (path, source, target) => {
  validate(path, source, VALIDATION_TYPES.VALID_PATH);
  validate(path, source, VALIDATION_TYPES.IS_FILE);

  validate(path, dirname(target), VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_DIRECTORY);

  const sourceFile = basename(source);

  const readStream = createReadStream(resolve(path, source));
  const writeStream = createWriteStream(
    resolve(path, target, `${sourceFile}.gz`)
  );
  const brotli = createBrotliCompress();

  readStream.pipe(brotli).pipe(writeStream);
};

const decompress = async (path, source, target) => {
  validate(path, source, VALIDATION_TYPES.VALID_PATH);
  validate(path, source, VALIDATION_TYPES.IS_FILE);

  validate(path, dirname(target), VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_DIRECTORY);

  const sourceFile = basename(source, '.gz');

  const readStream = createReadStream(resolve(path, source));
  const writeStream = createWriteStream(resolve(path, target, sourceFile));
  const brotli = createBrotliDecompress();

  readStream.pipe(brotli).pipe(writeStream);
};

export default handleCompression;
