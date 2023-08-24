import instance, { APiResponse, ResultData } from '@/apis/index';
import {
  BaseRecord, Group, ReplayMessage,
} from '@/types/channel';
import { MessageRecordFrom, ReplayMessageForm } from '@/types/channel/request/message';
import { RecallRecord } from '@/types/channel/request/recall';
import { ThumbType } from '@/types/channel/request/thumb';
import { roomMembers } from '@/types/channel/response/message';
import { roomID } from '@/types/channel/response/base';

/**
 * 获取聊天记录
 * @param page 页
 * @param room 房间id 0代表大厅房间
 */
const getChatRecordsAsync = async (room: roomID, page: number):

    APiResponse<ResultData<BaseRecord<ReplayMessage>[]>> =>
  instance.get(
    {
      url: 'chat/record/',
      params: {
        room, page,
      },
      isAuth: false,
    },
  );
/**
 * 获取在线人数
 */
const getOnlineUsersAsync = async (room: number): APiResponse<roomMembers> =>
//     http://127.0.0.1:5173/api/chat/record/
  instance.get(
    {
      url: 'chat/online/',
      params: { room },
      isAuth: false,
    },
  );
/**
 * 发送消息
 * @param msg 消息对象 BaseRecord
 */
const sendMessageAsync = async (msg:MessageRecordFrom<ReplayMessageForm>): APiResponse<any> =>
  instance.post({
    url: 'chat/msg/',
    data: {
      ...msg,
    },
    isAuth: true,
  });
/**
 * 消息撤回
 * @param obj
 */
const recallMessageAsync = async (obj: RecallRecord): APiResponse<any> =>
  instance.post({
    url: 'chat/recall/',
    data: {
      ...obj,
    },
    isAuth: true,
  });
// http://127.0.0.1:8000/api/chat/file/
/**
 * 获取cos凭证
 * @param path
 * @param policy
 */
const getCosCredentialAsync = async (path: string, policy: string):
    APiResponse<any> => instance.get({
  url: path,
  params: {
    policy,
  },
  isAuth: true,
});
/**
 * 点赞操作
 * @param data
 */
const sendThumbActionAsync = (data: ThumbType): APiResponse<any> =>
  instance.post({
    url: 'chat/thumb/',
    data: {
      ...data,
    },
    isAuth: true,
  });
/**
 * 创建群聊
 * @param data
 */
const createChatRoomAsync = (data: any): APiResponse<Group> => instance.post({
  url: '/chat/room/',
  data,
  isAuth: true,
});
/**
 * 获取房间信息，不存在的话就跳到404页面，房间不存在
 * @param room 房间id
 */
const getRoomInformAsync = (room: roomID): APiResponse<Group> => instance.get({
  url: '/chat/room/',
  params: {
    room,
  },
  isAuth: false,
});
/**
 * 获取全部群聊
 * @param page
 */
const getRoomAsync = (page:number):APiResponse<ResultData<Group[]>> => instance.get({
  url: '/chat/join',
  params: { page },
  isAuth: false,
});
const joinRoomAsync = (id:number, password:string):APiResponse<Group> => instance.post({
  url: '/chat/join/',
  data: { id, password },
  isAuth: true,
});

export {
  getChatRecordsAsync,
  getOnlineUsersAsync,
  sendMessageAsync,
  recallMessageAsync,
  getCosCredentialAsync,
  sendThumbActionAsync,
  createChatRoomAsync,
  getRoomInformAsync,
  getRoomAsync,
  joinRoomAsync,
};
