import { readdir, stat } from 'fs/promises';
import { resolve } from 'path';
import output from './handlers/output.mjs';
import OUTPUT_TYPES from './constants/output.mjs';
import validate from './handlers/validation.mjs';
import VALIDATION_TYPES from './constants/validations.mjs';
import ERROR_MESSAGES from './constants/errors.mjs';

const handleNavigation = async (path, { command, params }) => {
  switch (command) {
    case 'up':
      return await up(path);
    case 'cd':
      return await cd(path, ...params);
    case 'ls':
      return await getList(path);
    default:
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
};

const up = async (path) => {
  return await resolve(path, '..');
};

const cd = async (path, target) => {
  validate(path, target, VALIDATION_TYPES.VALID_PATH);
  validate(path, target, VALIDATION_TYPES.IS_DIRECTORY);
  return await resolve(path, target);
};

const getList = async (path) => {
  validate(path, '', VALIDATION_TYPES.VALID_PATH);
  validate(path, '', VALIDATION_TYPES.IS_DIRECTORY);
  await readdir(path)
    .then((childs) => {
      return Promise.all(
        childs.map(async (child) => {
          const meta = await stat(resolve(path, child));
          return {
            Name: child,
            Type: meta.isDirectory() ? 'directory' : 'file',
          };
        })
      );
    })
    .then((childs) => {
      const table = childs.sort((a, b) => {
        return a.Type === b.Type
          ? a.Name > b.Name
            ? 1
            : -1
          : a.Type > b.Type
          ? 1
          : -1;
      });
      output(OUTPUT_TYPES.TABLE, table);
    });

  return path;
};

export default handleNavigation;
