import { getUserName } from '../os.mjs';

const parseArgs = async () => {
  const username = await process.argv.find((arg) =>
    arg.startsWith('--username=')
  );
  return username ? username.split('=')[1] : getUserName();
};

const parseCommandLine = async (commandLine) => {
  const [command, ...params] = commandLine.trim().split(' ');
  return await { command, params };
};

export { parseArgs, parseCommandLine };
