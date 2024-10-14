import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import VALIDATION_TYPES from './constants/validations.mjs';
import validate from './handlers/validation.mjs';

const handleHash = async (path, { params }) => {
  return await calculateHash(path, ...params);
};

const calculateHash = async (path, target) => {
  validate(path, target, VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_FILE);

  const readStream = createReadStream(resolve(path, target));
  const hash = createHash('sha256');
  return await readStream.pipe(hash).digest('hex');
};

export default handleHash;
