import { acceptHMRUpdate, defineStore } from 'pinia';

import { PushType } from '@/types/t/push';

import isTimeElapsed from '@/utils/elapsed';
import { getOnlineAPI, getRecordAPi } from '@/apis/channel';
import { BaseRecord } from '@/types/channel';

const useChannelStore = defineStore(
  'channel', {
    // 推荐使用 完整类型推断的箭头函数
    state: () => ({
      //   聊天消息列表
      messageList: [] as BaseRecord[],
      onlineList: [] as PushType[],

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
      deleteRecord(msg:BaseRecord):boolean {
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
      asyncPushMoreRecord(itemList: BaseRecord[]) {
        this.setRecordMessage(itemList);
      },
      /**
       * 设置历史记录
       * @param itemList 列表
       */
      setRecordMessage(itemList: BaseRecord[]) {
        itemList.forEach((item: BaseRecord) => {
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
      updateOnlineStatus(msg: PushType, status :boolean) {
        console.log(msg);
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
        const { data } = await getOnlineAPI();
        this.onlineList = data;
      },
      /**
       * 获取历史记录
       */
      async asyncRecord() {
        const res = await getRecordAPi();
        // 进行翻转
        console.log(res);
        this.setRecordMessage(res.data.results);
      },
    },
  },
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChannelStore, import.meta.hot));
}

export default useChannelStore;
