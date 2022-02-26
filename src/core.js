import { Airgram, Auth } from 'airgram';
import prompt from 'prompt';
import dotenv from 'dotenv';
import { saveToFile } from './utils';

const { API_ID, API_HASH, TDLIB_COMMAND, BOT_STARTED } = dotenv.config().parsed ?? {};

const init = () => {
  let apiId = API_ID;
  let apiHash = API_HASH;
  if (!apiId || !apiHash) {
    prompt.get(['apiId', 'apiHash'], (err, result) => {
      if (!result.apiId || !result.apiHash) {
        throw Error(
          'Please create app_id by following https://core.telegram.org/api/obtaining_api_id'
        );
      }
      apiId = result.appId;
      apiHash = result.apiHash;
      saveToFile('API_HASH', apiHash);
      saveToFile('API_ID', apiId);
    });
  }

  const airgram = new Airgram({
    apiId,
    apiHash,
    command: TDLIB_COMMAND,
    logVerbosityLevel: 1,
    useChatInfoDatabase: true,
    useMessageDatabase: true,
  });

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
  airgram.use(auth);

  return airgram.api;
};

export default async () => {
  const app = init();

  const getChatId = async (link) => {
    const { response } = await app.searchPublicChat({
      username: '@raw_data_bot',
    });

    const chatId = response.id;
    if (!BOT_STARTED) {
      await app.sendBotStartMessage({
        chatId,
      });
      saveToFile('BOT_STARTED', 'true');
    }

    await app.sendMessage({
      chatId,
      inputMessageContent: {
        '@type': 'inputMessageText',
        text: {
          text: link,
        },
      },
    });

    const { response: chatHistoryResp } = await app.getChatHistory({
      chatId,
      limit: 2,
    });
    const lastMessage = (chatHistoryResp.messages ?? []).at(-1);

    if (!lastMessage) {
      console.log('Not found');
      return;
    }

    const data = lastMessage.content.text.text
      .split('\n')
      .filter((text) => text.includes('id') || text.includes('@'));

    if (data.length === 0) {
      console.log('Data not found');
      return;
    }

    const [name, idEntry = ''] = data;
    const [, chatIdToReport] = idEntry.split(':');
    if (!chatIdToReport) {
      console.log('Id not found');
      return;
    }

    const publicChat = await app.searchPublicChat({
      username: name,
    });

    console.log(publicChat);
    console.log(chatIdToReport);

    return Number(chatIdToReport);
  };

  return {
    reportChat: async (link, reason = '', type = 'chatReportReasonViolence') => {
      try {
        const chatId = await getChatId(link);
        const { response } = await app.reportChat({
          chatId,
          reason: {
            _: type,
          },
          text: reason,
        });
        console.log(`${response.code}-${response.message}`);
      } catch (err) {
        console.log(err);
      }
    },
  };
};
