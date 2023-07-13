import instance from '@/apis/index';

import { IjoinState } from '@/router/type';

// @ts-ignore
const joinChannelAPi = async (form: IjoinState) => instance.post(
  {
    url: 'record/',
    data: {
      ...form,
    },

  },
);
/**
 * 获取聊天记录
 * @param page 页
 * @param room 房间id 0代表大厅房间
 */
const getRecordAPi = async (page: number = 1, room: number = 0) =>
//     http://127.0.0.1:5173/api/chat/record/
  instance.get(
    {
      url: 'chat/record/',
      params: {
        page, room,
      },
    },
  );
/**
 * 获取在线人数
 */
const getOnlineAPI = async () =>
//     http://127.0.0.1:5173/api/chat/record/
  instance.get(
    {
      url: 'chat/online/',
    },
  );
export {
  // eslint-disable-next-line import/prefer-default-export
  joinChannelAPi, getRecordAPi, getOnlineAPI,
};
