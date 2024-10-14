import { rename, rm, writeFile } from 'node:fs/promises';
import { copyFile, moveFile, readFile } from './streams.mjs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import ERROR_MESSAGES from './constants/errors.mjs';
import validate from './handlers/validation.mjs';
import VALIDATION_TYPES from './constants/validations.mjs';

const handleFS = async (path, { command, params }) => {
  switch (command) {
    case 'cat':
      return await readFile(path, ...params);
    case 'add':
      return await createFile(path, ...params);
    case 'rn':
      return await renameFile(path, ...params);
    case 'cp':
      return await copyFile(path, ...params);
    case 'mv':
      return await moveFile(path, ...params);
    case 'rm':
      return await removeFile(path, ...params);
    default:
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
};

const createFile = async (path, target) => {
  validate(path, dirname(target), VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.ALREADY_EXIST);

  await writeFile(resolve(path, target), '', {
    flag: 'wx',
    encoding: 'utf-8',
  });
};

const renameFile = async (path, source, target) => {
  validate(path, source, VALIDATION_TYPES.VALID_PATH);
  validate(path, source, VALIDATION_TYPES.IS_FILE);

  const sourceDir = dirname(source);
  const sourceFile = basename(source);

  if (target !== basename(target) || !extname(target))
    throw new Error(
      `${ERROR_MESSAGES.OPERATION_FAILED}: '${target}' must have [filename].[ext] format`
    );

  validate(path, join(sourceDir, target), VALIDATION_TYPES.ALREADY_EXIST);

  await rename(
    resolve(path, sourceDir, sourceFile),
    resolve(path, sourceDir, target)
  );
};

const removeFile = async (path, source) => {
  validate(path, source, VALIDATION_TYPES.VALID_PATH);
  validate(path, source, VALIDATION_TYPES.IS_FILE);
  await rm(resolve(path, source));
};

export { handleFS, removeFile };
