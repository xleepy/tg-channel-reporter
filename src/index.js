#! /usr/bin/env node
import Telegram from './core';
import prompt from 'prompt';
import { readChannelsFile, checkTelegramChannelPattern } from './utils';

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

  const delayedReport = (link) =>
    new Promise((resolve) =>
      setTimeout(async () => {
        await app.reportChat(link, reason, type);
        resolve();
      }, 1000)
    );

  await Promise.all(allChannels.map(delayedReport));

  process.kill(process.pid, 'SIGTERM');
})();
