#! /usr/bin/env node
import Telegram from './core';
import prompt from 'prompt';
import { readChannelsFile, checkTelegramChannelPattern, chunk } from './utils';

(async () => {
  const app = new Telegram();
  await app.init();

  const filePath = process.argv[2];
  const allChannels = await readChannelsFile(filePath);

  if (allChannels.length === 0) {
    const { links } = await prompt.get(['links']);
    allChannels.push(
      ...(links
        ?.split(',')
        .map((link) => link.trim())
        .filter(checkTelegramChannelPattern) ?? [])
    );
  }

  const { reason, type } = await prompt.get([
    {
      name: 'reason',
      default:
        'There are a lot of posts with threats against the Ukrainian military.  Many photographs of the dead, blood and weapons.  Block it!',
    },
    { default: 'chatReportReasonViolence', name: 'type' },
  ]);

  const delayedReport = (multiplier = 1) => {
    return (link) => {
      return new Promise((resolve) =>
        setTimeout(async () => {
          await app.reportChat(link, reason, type);
          resolve();
        }, 1000 * 60 * multiplier)
      );
    };
  };

  const chunks = chunk(allChannels, 15);

  let counter = 1;
  // create for each chunk delay with incremental idx to reduce occurrence of timeout issue
  const chunksPromises = chunks.flatMap((chunk) => {
    if (counter > 5) {
      counter = 1;
    }
    console.log(`channels list part will run minimum after ${counter} second:`, chunk);
    return chunk.map(delayedReport(counter++));
  });

  await Promise.all(chunksPromises);

  process.kill(process.pid, 'SIGTERM');
})();
