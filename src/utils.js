import fs from 'fs/promises';
import path from 'path';

export const saveToFile = (key, value) => {
  return fs.appendFile(path.resolve('.env'), `${key}=${value}`);
};

export const checkTelegramChannelPattern = (line) => {
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
