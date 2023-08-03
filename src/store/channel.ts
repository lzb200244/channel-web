import { acceptHMRUpdate, defineStore } from 'pinia';

import isTimeElapsed from '@/utils/elapsed';
import { getOnlineAPI, getRecordAPi } from '@/apis/channel';

import { PushType } from '@/types/channel/modules/push';
import {
  BaseRecord, ReplayMessage, roomUserInfoMap, ThumbMessage,
} from '@/types/channel';

const useChannelStore = defineStore(
  'channel', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      //   聊天消息列表
      messageList: [] as BaseRecord<ReplayMessage>[],
      onlineList: [] as PushType[],
      userMap: roomUserInfoMap, // 记录用户id对应关系

    }),
    actions: {
      /**
             * 存储新的记录
             * @param item
             */
      pushRecordMessage(item: BaseRecord) {
        this.messageList.unshift(item);
      },
      /**
             * 进行撤回
             * @param msg
             */
      deleteRecord(msg: BaseRecord): boolean {
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
      asyncPushMoreRecord(itemList: BaseRecord<ReplayMessage>[]) {
        this.setRecordMessage(itemList);
      },
      /**
             * 设置历史记录
             * @param itemList 列表
             */
      setRecordMessage(itemList: BaseRecord<ReplayMessage>[]) {
        itemList.forEach((item: BaseRecord<ReplayMessage>) => {
          // 是否过期2分钟
          if (isTimeElapsed(item.message.time, 2)) {
            // 过期了就不支持撤回了
            this.messageList.push(Object.freeze(item));
          } else {
            this.messageList.push(item);
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
        this.onlineList.forEach((item) => {
          if (item.user.userID === msg.user.userID) {
            item.user.isActive = status;
          }
        });
      },
      /**
             * 获取当前在线人数
             */
      async getOnline() {
        const res = await getOnlineAPI();
        this.onlineList = res.data;
        this.onlineList.forEach((item) => {
          this.userMap.set(item.user.userID, {
            username: item.user.username,
            avatar: item.user.avatar,
          });
        });
      },
      /**
             * 获取历史记录
             */
      async asyncRecord() {
        const res = await getRecordAPi();
        // 进行翻转
        this.setRecordMessage(res.data.results);
      },
      /**
             * 更新消息的赞数量
             */
      updateRecordLikes(op: ThumbMessage) {
        console.log(op);
        for (let i = 0; i < this.messageList.length; i++) {
          const item = this.messageList[i];

          if (item.message.msgID === op.message.msgID) {
            item.message.messageStatus.likes += op.message.isLike === 1 ? 1 : -1;

            break; // 退出循环
          }
        }
      },
    },
    getters: {
      getUserNameByUserName: (state) => (userID:number) => state.userMap.get(userID)?.username,
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}

export default useChannelStore;
