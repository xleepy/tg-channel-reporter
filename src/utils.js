import fs from 'fs/promises';
import path from 'path';

export const saveToFile = (key, value) => {
  return fs.appendFile(path.resolve('.env'), `${key}=${value}`);
};
