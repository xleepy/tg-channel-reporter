#! /usr/bin/env node
import app from './core';
import prompt from 'prompt';
import { readChannelsFile } from './utils';

(async () => {
  const { reportChat } = await app();

  const allChannels = await readChannelsFile();

  if (allChannels.length === 0) {
    const { links } = await prompt.get(['links']);
    allChannels.push(links.split(',').map((link) => link.trim()) ?? []);
  }

  const { reason, type } = await prompt.get([
    {
      name: 'reason',
      default:
        'There are a lot of posts with threats against the Ukrainian military.  Many photographs of the dead, blood and weapons.  Block it!',
    },
    { default: 'chatReportReasonViolence', name: 'type' },
  ]);

  allChannels.forEach((link) => {
    reportChat(link, reason, type);
  });
})();
