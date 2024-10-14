import { basename, resolve } from 'path';
import ERROR_MESSAGES from '../constants/errors.mjs';
import VALIDATION_TYPES from '../constants/validations.mjs';
import { existsSync, statSync } from 'fs';

const validate = (path, source, type) => {
  const sourcePath = resolve(path, source);
  switch (type) {
    case VALIDATION_TYPES.VALID_PATH: {
      if (existsSync(sourcePath)) return;
      throw new Error(
        `${ERROR_MESSAGES.OPERATION_FAILED}: ${ERROR_MESSAGES.INVALID_PATH} ${sourcePath}.`
      );
    }
    case VALIDATION_TYPES.ALREADY_EXIST: {
      if (!existsSync(sourcePath)) return;
      throw new Error(
        `${ERROR_MESSAGES.OPERATION_FAILED}: '${basename(source)}' ${
          ERROR_MESSAGES.ALREADY_EXIST
        }`
      );
    }
    case VALIDATION_TYPES.IS_FILE: {
      if (statSync(sourcePath).isFile()) return;
      throw new Error(
        `${ERROR_MESSAGES.OPERATION_FAILED}: ${source} ${ERROR_MESSAGES.NOT_A_FILE}`
      );
    }
    case VALIDATION_TYPES.IS_DIRECTORY: {
      if (statSync(sourcePath).isDirectory()) return;
      throw new Error(
        `${ERROR_MESSAGES.OPERATION_FAILED}: ${source} ${ERROR_MESSAGES.NOT_A_DIRECTORY}`
      );
    }
  }
};

export default validate;
