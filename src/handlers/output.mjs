import { error, log, table } from 'console';
import OUTPUT_TYPES from '../constants/output.mjs';

const output = (type, data) => {
  switch (type) {
    case OUTPUT_TYPES.LOG:
      log(data);
      break;
    case OUTPUT_TYPES.ERROR:
      error(data);
      break;
    case OUTPUT_TYPES.TABLE:
      table(data);
      break;
    default:
      log(data);
      break;
  }
};

export default output;
