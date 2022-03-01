import { Airgram, Auth } from 'airgram';
import prompt from 'prompt';
import dotenv from 'dotenv';

const { API_ID, API_HASH, TDLIB_COMMAND } = dotenv.config().parsed ?? {};

export default class Telegram {
  airgram;
  constructor() {
    if (!API_ID || !API_HASH) {
      throw Error(
        'Please create app_id by following https://core.telegram.org/api/obtaining_api_id'
      );
    }
    this.airgram = new Airgram({
      apiId: API_ID,
      apiHash: API_HASH,
      command: TDLIB_COMMAND,
      logVerbosityLevel: 1,
      useChatInfoDatabase: true,
      useMessageDatabase: true,
    });
  }

  async init() {
    return new Promise((resolve) => {
      const auth = new Auth({
        phoneNumber: async () => {
          const { phone_number } = await prompt.get('phone_number');
          return phone_number;
        },
        password: async () => {
          const { password } = await prompt.get('password');
          return password ?? '';
        },
        code: async () => {
          const { code } = await prompt.get('code');
          return code;
        },
      });

      this.airgram.use(auth);
      const intervalId = setInterval(() => {
        if (auth.isAuthorized) {
          clearInterval(intervalId);
          resolve();
        }
      }, 100);
    });
  }

  async getChatId(link) {
    const { response } = await this.airgram.api.searchPublicChat({
      username: link.startsWith('@') ? link : link.split('/').at(-1),
    });
    if (response._ === 'error') {
      console.log(`${link} -> ${response.code} - ${response.message}`);
      return null;
    }
    return response.id;
  }

  async reportChat(link, reason = '', type = 'chatReportReasonViolence') {
    try {
      const chatId = await this.getChatId(link);
      if (!chatId) {
        return;
      }
      const { response } = await this.airgram.api.reportChat({
        chatId,
        reason: {
          _: type,
        },
        text: reason,
      });
      console.log(
        `${link} - ${response._ === 'error' ? `${response.code} - ${response.message}` : 'ok'}`
      );
    } catch (err) {
      console.log(err);
    }
  }
}
