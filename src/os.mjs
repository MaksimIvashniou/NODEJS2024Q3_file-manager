import os from 'node:os';
import ERROR_MESSAGES from './constants/errors.mjs';

const handleOS = async ({ params }) => {
  switch (`${params}`) {
    case '--EOL':
      return await getEOL();
    case '--cpus':
      return await getCPUsInfo();
    case '--homedir':
      return await getHomeDir();
    case '--username':
      return await getUserName();
    case '--architecture':
      return await getArch();
    default:
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }
};

const getEOL = async () => await JSON.stringify(os.EOL);

const getCPUsInfo = async () => {
  const cores = await os.cpus();
  return {
    count: cores.length,
    cores: cores.map(({ model, speed }) => ({ model, speed })),
  };
};

const getHomeDir = async () => await os.homedir();

const getUserName = async () => await os.userInfo().username;

const getArch = async () => await os.arch();

export { getHomeDir, getUserName, handleOS };
