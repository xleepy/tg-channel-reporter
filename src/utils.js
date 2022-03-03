import fs from 'fs/promises';
import path from 'path';

export const saveToFile = (key, value) => {
  return fs.appendFile(path.resolve('.env'), `${key}=${value}`);
};

export const checkTelegramChannelPattern = line => {
  return line.length > 0 && (line.startsWith('https://t.me') || line.startsWith('@'));
};

// TODO: custom file name support
export const readChannelsFile = async (fileName = 'channels.txt') => {
  try {
    const data = await fs.readFile(path.resolve(fileName), 'utf-8');
    return (data?.split('\n') ?? []).filter(checkTelegramChannelPattern);
  } catch (err) {
    console.log('No channels.txt ');
    return [];
  }
};

// Poor mans lodash chunk https://github.com/lodash/lodash/blob/4.17.15/lodash.js#L6839
export function chunk(array = [], size = 0) {
  const length = array.length;
  if (length === 0 || size === 0) {
    return [];
  }
  let index = 0;
  const chunkArray = Array(Math.ceil(length / size));
  for (let resIndex = 0; resIndex < length - 1; resIndex++) {
    const chunkToAppend = array.slice(index, (index += size));
    if (chunkToAppend.length === 0) {
      break;
    }
    chunkArray[resIndex] = chunkToAppend;
  }
  return chunkArray;
}
