import { defineStore, acceptHMRUpdate } from 'pinia';

import { MessageItemType, MessageType, PushMessage } from '@src/types/channel';
import isTimeElapsed from '@/utils/elapsed';
import { getRecordAPi, getOnlineAPI } from '@/apis/channel';

const useChannelStore = defineStore(
  'channel', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      //   聊天消息列表
      messageList: [] as MessageType[],
      onlineList: [] as PushMessage[],
      OnlineListSet: new Set(),
    }),
    actions: {
      /**
       * 存储新的记录
       * @param item
       */
      pushRecordMessage(item: MessageType) {
        this.messageList.unshift(item);
      },
      /**
       * 进行撤回
       * @param msg
       */
      deleteRecord(msg:MessageType) {
        //   删除该条,需要是撤销功能有提示
        this.messageList.forEach((item, idx) => {
          // 更新值
          if (msg.message.msgID === item.message.msgID) {
            Object.assign(item, msg);
          }
          this.messageList.push(item);
        });
      },
      /**
       * 请求跟多的历史记录
       * @param itemList

       */
      asyncPushMoreRecord(itemList: MessageType[]) {
        this.setRecordMessage(itemList);
      },
      /**
       * 设置历史记录
       * @param itemList 列表
       */
      setRecordMessage(itemList: MessageType[]) {
        itemList.forEach((item: MessageType) => {
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
       * @param item
       */
      pushOnline(item: PushMessage) {
        if (!this.OnlineListSet.has(item.message.userID)) {
          this.OnlineListSet.add(item.message.userID);
          this.onlineList.push(item);
        }
      },
      /**
       * 退出群聊通知
       * @param msg
       */
      popOnline(msg: PushMessage) {
        this.onlineList = this.onlineList.filter((
          item,
        ) => item.message.userID !== msg.message.userID);
        // 退出集合
        this.OnlineListSet.delete(msg.message.userID);
      },
      /**
       * 获取当前在线人数
       */
      async getOnline() {
        const { data } = await getOnlineAPI();
        data.forEach((item:PushMessage, idx:number) => {
          if (!this.OnlineListSet.has(item.message.userID)) {
            this.OnlineListSet.add(item.message.userID);
            this.onlineList.push(item);
          }
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
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}

export default useChannelStore;
