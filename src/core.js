import { Airgram, Auth } from 'airgram';
import prompt from 'prompt';
import dotenv from 'dotenv';

const { API_ID, API_HASH, TDLIB_COMMAND } = dotenv.config().parsed ?? {};

const init = () => {
  if (!API_ID || !API_HASH) {
    throw Error('Please create app_id by following https://core.telegram.org/api/obtaining_api_id');
  }

  const airgram = new Airgram({
    apiId: API_ID,
    apiHash: API_HASH,
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
      username: link.startsWith('@') ? link : link.split('/').at(-1),
    });
    return response.id;
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
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  };
};
