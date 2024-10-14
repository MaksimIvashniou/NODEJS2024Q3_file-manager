import process from 'process';
import output from './src/handlers/output.mjs';
import OUTPUT_TYPES from './src/constants/output.mjs';
import ERROR_MESSAGES from './src/constants/errors.mjs';
import { parseArgs, parseCommandLine } from './src/handlers/cli.mjs';
import handleNavigation from './src/navigation.mjs';
import handleCompression from './src/compress.mjs';
import { handleFS } from './src/fs.mjs';
import { getHomeDir, handleOS } from './src/os.mjs';
import handleHash from './src/hash.mjs';

(async () => {
  const user = await parseArgs();
  let path = await getHomeDir();

  output(OUTPUT_TYPES.LOG, `Welcome to the File Manager, ${user}!`);
  output(OUTPUT_TYPES.LOG, `You are currently in ${path}`);

  process.on('SIGINT', () => {
    output(
      OUTPUT_TYPES.LOG,
      `Thank you for using File Manager, ${user}, goodbye!`
    );
    process.exit();
  });

  process.stdin.on('data', async (data) => {
    try {
      const cl = await parseCommandLine(data.toString());
      switch (cl.command) {
        case '.exit':
          process.emit('SIGINT');
          break;
        case 'up':
        case 'cd':
        case 'ls':
          path = await handleNavigation(path, cl);
          break;
        case 'cat':
        case 'add':
        case 'rn':
        case 'cp':
        case 'mv':
        case 'rm': {
          await handleFS(path, cl);
          break;
        }
        case 'os': {
          await handleOS(cl).then((data) => {
            if (data) output(OUTPUT_TYPES.LOG, data);
          });
          break;
        }
        case 'hash': {
          await handleHash(path, cl).then((data) => {
            if (data) output(OUTPUT_TYPES.LOG, data);
          });
          break;
        }
        case 'compress':
        case 'decompress': {
          await handleCompression(path, cl);
          break;
        }
        default: {
          output(OUTPUT_TYPES.ERROR, ERROR_MESSAGES.INVALID_INPUT);
          break;
        }
      }
    } catch (error) {
      output(OUTPUT_TYPES.ERROR, error.message);
    } finally {
      output(OUTPUT_TYPES.LOG, `You are currently in ${path}`);
    }
  });
})();
