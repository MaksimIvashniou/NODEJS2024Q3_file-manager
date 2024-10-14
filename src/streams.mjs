import { basename, join, resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { removeFile } from './fs.mjs';
import output from './handlers/output.mjs';
import OUTPUT_TYPES from './constants/output.mjs';
import validate from './handlers/validation.mjs';
import VALIDATION_TYPES from './constants/validations.mjs';

const readFile = async (path, target) => {
  validate(path, target, VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_FILE);

  let data = '';
  createReadStream(resolve(path, target))
    .on('data', (chunk) => {
      data += chunk;
    })
    .on('end', () => {
      output(OUTPUT_TYPES.LOG, data);
    });
};

const copyFile = async (path, source, target) => {
  validate(path, source, VALIDATION_TYPES.VALID_PATH);
  validate(path, source, VALIDATION_TYPES.IS_FILE);

  const sourceFile = basename(source);

  validate(path, target, VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_DIRECTORY);
  validate(path, join(target, sourceFile), VALIDATION_TYPES.ALREADY_EXIST);

  const readableStream = createReadStream(resolve(path, source), 'utf-8');
  const writableStream = createWriteStream(resolve(path, target, sourceFile));

  await readableStream.pipe(writableStream);
};

const moveFile = async (path, source, target) => {
  await copyFile(path, source, target).then(async () => {
    await removeFile(path, source);
  });
};

export { readFile, copyFile, moveFile };
