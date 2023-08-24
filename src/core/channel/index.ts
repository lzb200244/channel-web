import {
  computed, onMounted, onUnmounted, reactive, watch,
} from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import {
  BaseUserItem,
  Group,
} from '@/types/channel';
import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { getChatRecordsAsync, recallMessageAsync, sendMessageAsync } from '@/apis/channel';
import useAccountStore from '@/store/account';
import isTimeElapsed from '@/utils/elapsed';

// @ts-ignore
import { FileInfoForm, MessageRecordFrom, ReplayMessageForm } from '@/types/channel/request/message';
// @ts-ignore
import { RecallRecord } from '@/types/channel/request/recall';
// @ts-ignore
import { MessageRecord, ReplayMessage } from '@/types/channel/response/message';
import useChannelStore from '@/store/channel';

const useChannelStoreMessage = () => {
  let virtual: HTMLElement;
  const useChannel = useChannelStore();
  const accountStore = useAccountStore();
  const route = useRoute();
  const roomID = computed(
    () => (Number.isNaN(Number(route.params.roomID)) ? 1 : Number(route.params.roomID)),
  );
  // 未携带room默认为0房(大厅

  /**
     * 聊天记录，进行翻转
     */
  const messageList = computed<MessageRecord<ReplayMessage>[]>(

    () => {
      const messages = useChannel.getMessageByRoomID(roomID.value);
      if (messages !== undefined) {
        return messages.map((item,
          idx) =>
          ({ ...item, id: idx + 1 }), // 添加唯一ID
        ).reverse();
      }
      return [] as MessageRecord<ReplayMessage>[];
    },
  );

  const roomInfo = computed<Group>(() => {
    const Info = useChannel.getRoomInfoByRoomID(roomID.value);
    if (Info !== undefined) {
      return Info;
    }
    return {} as Group;
  });
  const user = computed<BaseUserItem>(() => accountStore.channelUser);
  // 当前页数
  const pageConf = reactive({
    isLoading: false, // 是否加载
    currentPage: 1, // 当前页
    stop: false, // 是否停止
    pageSize: 10,
  });
    // 回复消息体
  const msg = reactive<MessageRecordFrom<ReplayMessageForm>>({
    type: PushTypeEnum.MESSAGE_PUSH,
    message: {
      content: '',
      type: MessageTypeEnum.TEXT,
      fileInfo: undefined,
      replay: undefined,
    },
    user: {
      userID: user.value.userID,
    },
    roomID: roomID.value,
  });
    /**
     * 滑动到底部
     */
  const scrollToBottom = () => {
    // 由于是虚拟列表渲染，高度不固定，默认每次进来加载滑动到底部给定一个最大值
    virtual.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  /**
   * 加载更多数据
   */
  const LoadMoreRecord = async () => {
    const { scrollTop } = virtual;

    // 检查是否满足加载更多的条件
    if (!pageConf.stop && scrollTop === 0 && !pageConf.isLoading) {
      pageConf.isLoading = true; // 设置加载状态为 true
      const res = await getChatRecordsAsync(++pageConf.currentPage, roomID.value);

      setTimeout(() => {
        useChannel.asyncPushMoreRecord(res.data.results, roomID.value);
        pageConf.isLoading = false; // 加载完成后，将加载状态设置为 false
      }, 200);
      // 超过最大数量，说明没有更多数据了
      if (res.data.count < pageConf.currentPage * pageConf.pageSize) {
        message.info('没有更多记录');
        // 没有更多记录
        pageConf.stop = true;
        // 这里建议将 isLoading 设置为 true，表示不再继续加载
        pageConf.isLoading = true;
      }
    }
  };
    /**
     * 处理一些消息的操作例如：撤回，点赞，踩
     * @param obj
     * @param tp 操作类型
     */
  const handleOpt = async (obj: MessageRecord<ReplayMessage>, tp: PushTypeEnum) => {
    // 撤回 => \types\channel\modules\recall.ts
    if (tp === PushTypeEnum.RECALL_PUSH) {
      // 是否过期两分钟不能撤回
      if (isTimeElapsed(obj.message.time, 2)) return message.info('逝去瞬间，无法挽回。');
      const recallItem: RecallRecord = {
        type: PushTypeEnum.RECALL_PUSH,
        message: {
          type: obj.message.type,
          msgID: obj.message.msgID,
        },
        roomID: roomID.value,
      };
      // 撤回
      await recallMessageAsync(recallItem);
    } else if (tp === PushTypeEnum.THUMB_PUSH) {
      if (obj.message.messageStatus) {
        // obj.message.messageStatus.userIsLike = !obj.message.messageStatus.userIsLike;
        // obj.message.messageStatus.likeCount++;
      }
    } else if (tp === PushTypeEnum.REPLAY_PUSH) {
      // 回复的是GPT
      if (obj.user.userID === 1) {
        msg.message.type = MessageTypeEnum.GPT;
      }
      msg.type = PushTypeEnum.REPLAY_PUSH;
      // 构造回复
      msg.message.replay = {
        type: obj.message.type, // 回复的消息类型
        msgID: obj.message.msgID,
        username: <string>useChannel.getUserNameByUserName(roomID.value, obj.user.userID),
        userID: obj.user.userID,
      };
    }
  };
  const handleMentions = (str: string): string => str.replace(/@([^ ]+)/g, '<span class="mention">@$1</span>');

  const cancelReplay = () => {
    if ('replay' in msg.message) {
      msg.type = PushTypeEnum.MESSAGE_PUSH;
      msg.message.replay = undefined;
    }
  };

  /**
     * 发送消息
     */
  const sendMessage = async (v: string) => {
    // 匿名用户
    if (!user.value.userID || !v) return;

    //   消息类型
    switch (msg.type) {
      // message处理
      case PushTypeEnum.MESSAGE_PUSH: {
        // msg.message.type = MessageTypeEnum.TEXT;
        msg.type = PushTypeEnum.MESSAGE_PUSH;
        msg.user.userID = user.value.userID;
        msg.message.content = handleMentions(v);
        break;
      }
      // 发送回复=>replay处理
      case PushTypeEnum.REPLAY_PUSH: {
        msg.type = PushTypeEnum.REPLAY_PUSH;
        msg.user.userID = user.value.userID;
        msg.message.content = handleMentions(v);
        console.log(msg);
        break;
      }
    }
    msg.roomID = roomID.value;
    await sendMessageAsync(msg);
    // socket.send(msg);
    msg.message.content = '';
    msg.message.type = MessageTypeEnum.TEXT;
    cancelReplay();
    setTimeout(() => {
      // 延迟一段时间再滚动到底部
      scrollToBottom();
    }, 100); // 可根据实际情况调整延迟时间
  };
    /**
     *
     * @param res 文件信息
     * @param tp
     */
  const sendFileMessage = async (res: FileInfoForm, tp: MessageTypeEnum) => {
    if (!user.value.userID) return;
    // 发送文件
    // res 存在fileSize,fileName等
    const fileObj: MessageRecordFrom<ReplayMessageForm> = {
      type: PushTypeEnum.MESSAGE_PUSH,
      message: {
        fileInfo: res,
        type: tp,
      },
      user: {
        userID: user.value.userID,
      },
      roomID: roomID.value,
    };
    // 存在回复
    if ('replay' in msg.message) {
      // 存在回复对象
      if (msg.message.replay) {
        fileObj.type = PushTypeEnum.REPLAY_PUSH;
        fileObj.message.replay = msg.message.replay;
      }
    }
    // socket.send(fileObj);
    await sendMessageAsync(fileObj);
    cancelReplay();
  };
    /**
     * 处理@xxx
     * @param op @ai还是@用户
     * @param text 用户名
     */
  const handleMention = (op: MessageTypeEnum, text:string) => {
    msg.message.type = op;
    if (text) {
      msg.message.content += `${text} `;
    }
  };
  onMounted(async () => {
    virtual = document.querySelector('.virtual-list') as HTMLElement;
    virtual.addEventListener('scroll', LoadMoreRecord);
  });
  onUnmounted(() => {
    virtual.removeEventListener('scroll', LoadMoreRecord);
  });

  return {
    pageConf,
    messageList,
    roomInfo,
    msg,
    user,
    LoadMoreRecord,
    handleOpt,
    handleMention,
    cancelReplay,
    sendMessage,
    sendFileMessage,
    scrollToBottom,

  };
};
export default useChannelStoreMessage;
