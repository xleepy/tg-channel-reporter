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
        .map(link => link.trim())
        .filter(checkTelegramChannelPattern) ?? [])
    );
  }

  const { reason, type, requestsCount } = await prompt.get([
    {
      name: 'reason',
      default:
        'There are a lot of posts with threats against the Ukrainian military.  Many photographs of the dead, blood and weapons.  Block it!',
    },
    { default: 'chatReportReasonViolence', name: 'type' },
    { name: 'requestsCount', description: 'Number of requests per second', default: 5 },
  ]);

  const delayedReport = (multiplier = 1) => {
    return link => {
      return new Promise(resolve =>
        setTimeout(async () => {
          await app.reportChat(link, reason, type);
          resolve();
        }, 1000 * 60 * multiplier)
      );
    };
  };

  const chunks = chunk(allChannels, Number(requestsCount));

  const [firstPart, secondPart] = chunk(chunks, chunks.length / 2);

  const createDelayedPromise =
    (increment = 0) =>
    (chunk, idx) => {
      const delayMultiplier = idx + 1 + increment;
      console.log(`channels list part will run minimum after ${delayMultiplier} second:`, chunk);
      return chunk.map(delayedReport(delayMultiplier));
    };

  // create for each chunk delay with incremental idx to reduce occurrence of timeout issue
  const firstChunkPromises = firstPart.flatMap(createDelayedPromise());
  const secondChunkPromises = secondPart.flatMap(createDelayedPromise(2));

  await Promise.all([...firstChunkPromises, ...secondChunkPromises]);

  process.kill(process.pid, 'SIGTERM');
})();
