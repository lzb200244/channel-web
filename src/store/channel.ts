import { acceptHMRUpdate, defineStore } from 'pinia';

import isTimeElapsed from '@/utils/elapsed';
import {
  getOnlineUsersAsync, getChatRecordsAsync, getRoomInformAsync, getRoomAsync,
} from '@/apis/channel';

import { PushType } from '@/types/channel/modules/push';
import {
  Group, roomUserInfoMap, ThumbMessage,
} from '@/types/channel';
import { MessageRecord, ReplayMessage, roomMembers } from '@/types/channel/response/message';
import { UserInfo } from '@/types/account';

const useChannelStore = defineStore(
  'channel', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      //   聊天消息列表
      messageList: [] as MessageRecord<ReplayMessage>[],
      onlineList: {
        online: [] as PushType[],
        offline: [] as PushType[],
      }as roomMembers, // 房间在线/离线情况
      userMap: roomUserInfoMap, // 记录用户id对应关系
      roomInfo: {} as Group,
      rooms: [] as Group[], // 所有的群聊
    }),
    actions: {
      /**
       * 添加新的聊天记录
       * @param item
       */
      pushRecordMessage(item: MessageRecord<ReplayMessage>) {
        this.messageList.unshift(item);
      },
      /**
       * 进行撤回
       * @param msg
       */
      deleteRecord(msg: MessageRecord<ReplayMessage>): boolean {
        //   删除该条,需要是撤销功能有提示
        this.messageList.forEach((item) => {
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
       * 请求跟多的历史记录
       * @param itemList
       */
      asyncPushMoreRecord(itemList: MessageRecord<ReplayMessage>[]) {
        this.setRecordMessage(itemList);
      },
      /**
       * 设置历史记录
       * @param itemList 列表
       */
      setRecordMessage(itemList: MessageRecord<ReplayMessage>[]) {
        itemList.forEach((item: MessageRecord<ReplayMessage>) => {
          // 是否过期2分钟
          if (isTimeElapsed(item.message.time, 2)) {
            // 过期了就不支持撤回了
            this.messageList.push(Object.freeze(item));
          } else {
            this.messageList.push(item);
          }
        });
      },
      clearRecord() {
        this.messageList = [];
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
        const sourceList = status ? this.onlineList.offline : this.onlineList.online;
        const targetList = status ? this.onlineList.online : this.onlineList.offline;
        const userIndex = sourceList.findIndex(
          (user_info:PushType) => user_info.user.userID === msg.user.userID,
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
      async getOnline(roomID: string) {
        const res = await getOnlineUsersAsync(roomID);
        this.onlineList = res.data;
        const processUser = (user: UserInfo) => {
          this.userMap.set(user.userID, user);
        };
        res.data.online.forEach((item) => processUser(item.user));
        res.data.offline.forEach((item) => processUser(item.user));
      },
      /**
       * 获取历史记录
       */
      async getRoomInfo(roomID: string) {
        const res = await getRoomInformAsync(roomID);
        this.roomInfo = res.data;
        return res;
        // 不存在群聊
      },
      async asyncRecord(page: number = 1, room: string = '0') {
        const res = await getChatRecordsAsync(page, room);
        // 进行翻转
        this.setRecordMessage(res.data.results);
        return res;
      },
      /**
       * 更新消息的赞数量
       */
      updateRecordLikes(op: ThumbMessage) {
        // for (let i = 0; i < this.messageList.length; i++) {
        //   const item = this.messageList[i];
        //   if (item.message.msgID === op.message.msgID) {
        //     item.message.messageStatus.likes += op.message.isLike === 1 ? 1 : -1;
        //     break; // 退出循环
        //   }
        // }
      },
      /**
       * 按页获取房间
       * @param page
       */
      async asyncGetRooms(page:number) {
        const res = await getRoomAsync(page);
        this.rooms = res.data.results;
      },
    },
    getters: {
      getUserNameByUserName: (state) => (userID: number) => state.userMap.get(userID)?.username,
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}

export default useChannelStore;
