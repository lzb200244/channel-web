import instance, { APiResponse } from '@/apis/index';
import {
  BaseRecord, Group, ReplayMessage, ThumbMessage,
} from '@/types/channel';
import { PushType } from '@/types/channel/modules/push';

/**
 * 获取聊天记录
 * @param page 页
 * @param room 房间id 0代表大厅房间
 */
const fetchChatRecords = async (page: number, room: string):
    APiResponse<{
        results: BaseRecord<ReplayMessage>[],
        count: number
    }> =>
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
const fetchOnlineUsers = async (roomID: string): APiResponse<PushType[]> =>
//     http://127.0.0.1:5173/api/chat/record/
  instance.get(
    {
      url: 'chat/online/',
      params: { roomID },
    },
  );
/**
 * 回消息
 * @param msg 消息对象 BaseRecord
 */
const sendChatMessage = async (msg: BaseRecord<ReplayMessage>): APiResponse<any> =>
  instance.post({
    url: 'chat/msg/',
    data: {
      ...msg,
    },
  });
/**
 * 消息撤回
 * @param obj
 */
const recallMessage = async (obj: any): APiResponse<any> =>
  instance.post({
    url: 'chat/recall/',
    data: {
      ...obj,
    },
  });
// http://127.0.0.1:8000/api/chat/file/
/**
 * 获取cos凭证
 * @param path
 * @param policy
 */
const fetchCosCredential = async (path: string, policy: string): APiResponse<any> => instance.get({
  url: path,
  params: {
    policy,
  },
});
/**
 * 点赞操作
 * @param data
 */
const handleThumbAction = (data: ThumbMessage): APiResponse<any> =>
  instance.post({
    url: 'chat/thumb/',
    data: {
      ...data,
    },
  });
/**
 * 创建群聊
 * @param data
 */
const createChatRoom = (data: any): APiResponse<any> => instance.post({
  url: '/chat/room/',
  data,
});
/**
 * 获取房间信息，不存在的话就跳到404页面，房间不存在
 * @param roomID 房间id
 */
const getRoomInformation = (roomID: string): APiResponse<Group> => instance.get({
  url: '/chat/room/',
  params: {
    roomID,
  },
});
export {
  // eslint-disable-next-line import/prefer-default-export
  fetchChatRecords,
  fetchOnlineUsers,
  sendChatMessage,
  recallMessage,
  fetchCosCredential,
  handleThumbAction,
  createChatRoom,
  getRoomInformation,
};
