#! /usr/bin/env node
import app from './core';
import prompt from 'prompt';

(async () => {
  const { reportChat } = await app();

  const { link, reason, type } = await prompt.get([
    'link',
    {
      name: 'reason',
      default:
        'There are a lot of posts with threats against the Ukrainian military.  Many photographs of the dead, blood and weapons.  Block it!',
    },
    { default: 'chatReportReasonViolence', name: 'type' },
  ]);

  const allLinks = link.split(',') ?? [];
  allLinks.forEach((link) => {
    reportChat(link.trim(), reason, type);
  });
})();
