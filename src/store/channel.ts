import { acceptHMRUpdate, defineStore } from 'pinia';

import {
  getChatRecordsAsync, getOnlineUsersAsync, getRoomAsync, getRoomInformAsync,
} from '@/apis/channel';

import { PushType } from '@/types/channel/modules/push';
import { Group } from '@/types/channel';
import {
  MessageRecord, ReplayMessage, roomMembers,
} from '@/types/channel/response/message';
import { UserInfo, UserMap } from '@/types/account';
import { roomID } from '@/types/channel/response/base';
import LRUCache from '@/utils/lru';
import WS from '@/utils/socket';
import { MessageTypeEnum } from '@/types/channel/enum';
import isTimeElapsed from '@/utils/elapsed';

const useChannelStore = defineStore(
  'channel', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      //   聊天消息列表
      rooms: [] as Group[], // 所有的群聊
      onlineMap: new Map<roomID, roomMembers>(),
      userMap: new Map<roomID, UserMap>(), // 记录用户id对应关系
      roomInfoMap: new Map<roomID, Group>(),
      messagesMap: new Map<roomID, MessageRecord<ReplayMessage>[]>(), // 实现lru的catch
      lruWsMap: new LRUCache<roomID, WS>(5), // lru缓存ws
      newMessageMap: new Map<roomID, string>(), // 房间的最新消息,进行通知
    }),
    actions: {
      /**
       * 获取某个房间的聊天记录，存在map里的
       * @param roomID
       */
      getMessageByRoomID(roomID: roomID):MessageRecord<ReplayMessage>[]|undefined {
        if (this.messagesMap.has(roomID)) {
          return this.messagesMap.get(roomID);
        }
        this.messagesMap.set(roomID, []);
        return this.messagesMap.get(roomID);
      },
      /**
       * 获取某个房间的在线人
       * @param roomID
       */
      getOnlineByRoomID(roomID: roomID): roomMembers|undefined {
        if (this.onlineMap.has(roomID)) {
          return this.onlineMap.get(roomID);
        }
        this.onlineMap.set(roomID, { online: [], offline: [] });
        return this.onlineMap.get(roomID);
      },
      /**
       * 获取某个房间用户映射表
       * @param roomID
       */
      getUserByRoomID(roomID: roomID): UserMap|undefined {
        if (this.userMap.has(roomID)) {
          return this.userMap.get(roomID);
        }
        this.userMap.set(roomID, new Map());
        return this.userMap.get(roomID);
      },
      /**
       * 获取某个房间信息
       * @param roomID
       */
      getRoomInfoByRoomID(roomID: roomID): Group|undefined {
        if (this.roomInfoMap.has(roomID)) {
          return this.roomInfoMap.get(roomID);
        }
        this.roomInfoMap.set(roomID, {} as Group);
        return this.roomInfoMap.get(roomID);
      },
      /**
       * 每个房间的最新消息，实现状态提醒
       * @param roomID
       */
      getNewMsgByRoomID(roomID: roomID): string|undefined {
        return this.newMessageMap.get(roomID);
      },
      /**
       * 删除某个房间的提醒状态
       * @param roomID
       */
      deleteNewMsg(roomID: roomID) {
        this.newMessageMap.delete(roomID);
      },
      /**
       * 进行撤回
       * @param msg
       */
      deleteRecord(msg: MessageRecord<ReplayMessage>):boolean {
        const messageList = this.getMessageByRoomID(msg.roomID);
        //   删除该条,需要是撤销功能有提示
        messageList?.forEach((item) => {
          // 更新值
          if (msg.message.msgID === item.message.msgID) {
            item.message.messageStatus.isDrop = true;
            item.message.messageStatus.drop = msg.message.messageStatus.drop;
            return true; // 找到处理完直接返回
          }
        });
        return false;
      },
      /**
       * 满5个ws了，添加删除最近最不常用的websocket
       * @param roomID
       */
      removeCatch(roomID: roomID) {
        // 关闭websocket

        // 删除缓存
        this.messagesMap.delete(roomID);
        this.onlineMap.delete(roomID);
        this.userMap.delete(roomID);
        this.roomInfoMap.delete(roomID);
      },
      /**
     * 添加新的一条聊天记录
     * @param msg
     */
      pushRecordMessage(msg: MessageRecord<ReplayMessage>) {
        if (msg.message.type === MessageTypeEnum.TEXT || msg.message.type === MessageTypeEnum.GPT) {
          // 消息
          this.newMessageMap.set(msg.roomID, `新消息：${<string>msg.message.content}`);
        } else if (msg.message.type === MessageTypeEnum.FILE) {
          // 文件
          this.newMessageMap.set(msg.roomID, <string>msg.message.fileInfo?.fileName);
        }
        // 更新房间的最新消息

        //  添加新的聊天记录，
        // fix: O(n)的操作。如果聊天记录太多，非常的慢。
        // this.getMessageByRoomID(msg.roomID)?.unshift(msg);
        // 修改为push操作,针对发言多,查询历史记录少的情况
        this.getMessageByRoomID(msg.roomID)?.push(msg);
      },
      /**
       * 请求跟多的历史记录
       * @param itemList
       * @param roomID 房间号
       */
      asyncPushMoreRecord(roomID:roomID, itemList: MessageRecord<ReplayMessage>[]) {
        this.setRecordMessage(roomID, itemList);
      },
      /**
       * 设置历史记录
       * @param itemList 列表
       * @param roomID
       */
      setRecordMessage(roomID:roomID = 1, itemList: MessageRecord<ReplayMessage>[]) {
        /**
         // fix: O(n)的操作。如果聊天记录太多，非常的慢。
        const roomMessage = this.getMessageByRoomID(roomID);
        itemList.forEach((item: MessageRecord<ReplayMessage>) => {
          // 是否过期2分钟
          if (isTimeElapsed(item.message.time, 2)) {
            // 过期了就不支持撤回了
            roomMessage?.push(Object.freeze(item));
          } else {
            roomMessage?.push(item);
          }
        });
         */
        // FIX： 修改为push操作,针对发言多,查询历史记录少的情况
        const roomMessage = this.getMessageByRoomID(roomID);
        itemList.forEach((item: MessageRecord<ReplayMessage>) => {
          if (isTimeElapsed(item.message.time, 2)) {
            roomMessage?.unshift(Object.freeze(item));
          } else {
            roomMessage?.unshift(item);
          }
        });
      },
      /**
       *  更新加入群聊的新人
       * @param msg
       */
      pushOnline(msg: PushType) {
        this.updateOnlineStatus(msg, true);
      },
      /**
       * 退出群聊通知
       * @param msg
       */
      popOnline(msg: PushType) {
        this.updateOnlineStatus(msg, false);
      },
      /**
     * 实时更新在线状态
     * @param msg
     * @param status 状态
     */
      updateOnlineStatus(msg: PushType, status: boolean) {
        const onlineList = this.getOnlineByRoomID(msg.roomID);
        if (onlineList === undefined) return;
        const sourceList = status ? onlineList.offline : onlineList.online;
        const targetList = status ? onlineList.online : onlineList.offline;
        const userIndex = sourceList.findIndex(
          (user_info: PushType) => user_info.user.userID === msg.user.userID,
        );
        if (userIndex !== -1) {
          const user = sourceList.splice(userIndex, 1)[0];
          user.user.isActive = status;
          targetList.push(user);
        }
      },
      /**
       * 获取当前在线人数
       */
      async getOnline(roomID: roomID) {
        const res = await getOnlineUsersAsync(roomID);

        this.onlineMap.set(roomID, res.data);
        const processUser = (user: UserInfo) => {
          this.getUserByRoomID(roomID)?.set(user.userID, user);
        };
        res.data.online.forEach((item) => processUser(item.user));
        res.data.offline.forEach((item) => processUser(item.user));
      },
      /**
       * 房间信息
       */
      async getRoomInfo(roomID: roomID) {
        const res = await getRoomInformAsync(roomID);
        this.roomInfoMap.set(roomID, res.data);
        return res;
        // 不存在群聊
      },
      /**
       * 获取某个房间聊天记录
       */
      async asyncRecord(roomID: roomID = 1, page: number = 1) {
        const res = await getChatRecordsAsync(roomID, page);
        this.setRecordMessage(roomID, res.data.results);
        return res;
      },
      /**
       * 获取全部群聊
       * @param page
       */
      async asyncGetRooms(page: number) {
        const res = await getRoomAsync(page);
        this.rooms = res.data.results;
      },
    },
    getters: {
      getUserNameByUserName: (state) =>
        (roomID:roomID, userID: number) => state.userMap.get(roomID)?.get(userID)?.username,
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}

export default useChannelStore;
