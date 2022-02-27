import fs from 'fs/promises';
import path from 'path';

export const saveToFile = (key, value) => {
  return fs.appendFile(path.resolve('.env'), `${key}=${value}`);
};

// TODO: custom file name support
export const readChannelsFile = async (fileName = 'channels.txt') => {
  try {
    const data = await fs.readFile(path.resolve(fileName), 'utf-8');
    return (data?.split('\n') ?? []).filter(Boolean);
  } catch (err) {
    console.log('No channels.txt ');
    return [];
  }
};
