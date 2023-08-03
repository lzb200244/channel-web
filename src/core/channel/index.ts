import {
  computed, nextTick, onMounted, onUnmounted, reactive,
} from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import {
  TextMessage, ImageMessage, FileInfo, BaseUserItem,
  BaseRecord, ReplayItem, ReplayMessage,
} from '@/types/channel';
import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { getRecordAPi, recallAPI, sendMsgAPI } from '@/apis/channel';
import useChannelStore from '@/store/channel';
import useAccountStore from '@/store/account';
import isTimeElapsed from '@/utils/elapsed';
import { RecallType } from '@/types/channel/modules/recall';
import WS from '@/utils/socket';

const useChannelMessage = () => {
  let virtual: HTMLElement;
  const channelStore = useChannelStore();
  const accountStore = useAccountStore();
  const route = useRoute();
  const roomID = +(route.query.room ?? 0); //
  // 请求聊天记录
  channelStore.asyncRecord();
  // 未携带room默认为0房(大厅
  const socket = new WS(`ws://127.0.0.1:8000/room/${roomID}/`);
  socket.connect();

  /**
     * 聊天记录，进行翻转
     */
  const messageList = computed<BaseRecord<ReplayMessage>[]>(
    () => channelStore.messageList.map((item:
                                                BaseRecord, idx: number) =>
      ({ ...item, id: idx + 1 }), // 使用展开语法创建一个新对象，添加唯一ID
    ).reverse());

  /**
     * 当前用户
     */
  const user = computed<BaseUserItem>(() => accountStore.channelUser);
  // 当前页数
  const pageConf = reactive({
    isLoading: false, // 是否加载
    currentPage: 1, // 当前页
    stop: false, // 是否停止
  });
    // 回复消息体
  const msg = reactive<BaseRecord<ReplayMessage>>({
    type: PushTypeEnum.MESSAGE_PUSH,
    message: {
      content: '',
      time: Date.now(),
      type: MessageTypeEnum.TEXT,
      messageStatus: {
        likes: 0,
        drop: '',
        isDrop: false,
        isLike: 0,
      },
      msgID: 0,
      roomID,
      fileInfo: undefined,
      replay: undefined,
    },
    user: {
      userID: user.value.userID,
    },
  });
    /**
     * 滑动到底部
     */
  const scrollToBottom = () => {
    // virtual.scrollTop = virtual.scrollHeight;
    //   由于是虚拟列表渲染，高度不固定，默认每次进来加载滑动到底部给定一个最大值
    virtual.scrollTop = Number.MAX_SAFE_INTEGER;
  };

  /**
     * 加载更多数据
     * @constructor
     */
  const LoadMoreRecord = async () => {
    const { scrollTop } = virtual; // 获取滚动条的位置，可能是 window.scrollY 或其他方式获取滚动位置的方法

    // 检查是否满足加载更多的条件
    if (!pageConf.stop && scrollTop === 0 && !pageConf.isLoading) {
      pageConf.isLoading = true; // 设置加载状态为 true

      const res = await getRecordAPi(++pageConf.currentPage, roomID as number);

      setTimeout(() => {
        channelStore.asyncPushMoreRecord(res.data.results);
        pageConf.isLoading = false; // 加载完成后，将加载状态设置为 false
      }, 500);
      if (res.data.count < 10) {
        message.info('喵的！not more more history');
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
  const handleOpt = async (obj: BaseRecord, tp: number) => {
    // 撤回 => \types\channel\modules\recall.ts
    if (tp === PushTypeEnum.RECALL_PUSH) {
      // 是否过期两分钟不能撤回
      if (isTimeElapsed(obj.message.time, 2)) return message.info('逝去瞬间，无法挽回。');
      const recallItem: RecallType = {
        type: PushTypeEnum.RECALL_PUSH,
        message: {
          type: obj.message.type,
          msgID: obj.message.msgID,
          messageStatus: {
            isDrop: true,
            drop: `${dayjs().format('HH:mm:ss ')} "${user.value.username}" 撤销了一条消息`,
            likes: obj.message.messageStatus.likes,
            isLike: 0,
          },
          time: Date.now(),
          roomID: roomID as number,
        },
      };

      await recallAPI(recallItem);
    } else if (tp === PushTypeEnum.THUMB_PUSH) {
      if (obj.message.messageStatus) {
        // obj.message.messageStatus.userIsLike = !obj.message.messageStatus.userIsLike;
        // obj.message.messageStatus.likeCount++;
      }
    } else if (tp === PushTypeEnum.REPLAY_PUSH) {
      //   obj 点击的回复对象
      msg.type = PushTypeEnum.REPLAY_PUSH;
      // 构造回复
      msg.message.replay = {
        type: obj.message.type, // 回复的消息类型
        msgID: obj.message.msgID,
        time: Date.now(),
        username: channelStore.getUserNameByUserName(obj.user.userID),
      } as ReplayItem;
    }
  };
  const handleMentions = (str: string): string => str.replace(/@([^ ]+)/g, '<span class="mention">@$1</span>');

  const cancelReplay = () => {
    if ('replay' in msg.message) {
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
        msg.message.type = MessageTypeEnum.TEXT;
        msg.type = PushTypeEnum.MESSAGE_PUSH;
        msg.user.userID = user.value.userID;
        (msg.message as TextMessage).content = handleMentions(v);
        break;
      }
      // 发送回复=>replay处理
      case PushTypeEnum.REPLAY_PUSH: {
        msg.message.type = MessageTypeEnum.TEXT; // MessageTypeEnum
        msg.type = PushTypeEnum.REPLAY_PUSH;
        msg.user.userID = user.value.userID;
        (msg.message as TextMessage).content = handleMentions(v);
        break;
      }
    }
    await sendMsgAPI(msg);
    // socket.send(msg);

    (msg.message as TextMessage).content = '';
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
  const sendFileMessage = async (res: FileInfo, tp:MessageTypeEnum) => {
    if (!user.value.userID) return;
    // 发送文件
    // res 存在fileSize,fileName等
    const fileObj: BaseRecord = {
      type: PushTypeEnum.MESSAGE_PUSH,
      message: {
        fileInfo: res as FileInfo,
        type: tp,
        time: Date.now(),
        msgID: 0,
        roomID,
        messageStatus: {
          likes: 0, isDrop: false, drop: '',
        },
      } as ImageMessage,
      user: {
        userID: user.value.userID,
      },
    };
    // 存在回复
    if ('replay' in msg.message) {
      // 存在回复对象
      if (msg.message.replay) {
        fileObj.type = PushTypeEnum.REPLAY_PUSH;
        (fileObj.message as ReplayMessage).replay = msg.message.replay;
      }
    }
    // socket.send(fileObj);
    await sendMsgAPI(fileObj);
    cancelReplay();
  };

  onMounted(async () => {
    //   每次加载页面到底部
    await nextTick(() => {
      setTimeout(scrollToBottom, 200);
    });
    virtual = document.querySelector('.virtual-list') as HTMLElement;
    virtual.addEventListener('scroll', LoadMoreRecord);
  });
  onUnmounted(() => {
    virtual.removeEventListener('scroll', LoadMoreRecord);
  });

  return {
    pageConf,
    socket,
    messageList,
    msg,
    user,
    LoadMoreRecord,
    handleOpt,
    cancelReplay,
    sendMessage,
    sendFileMessage,
  };
};
export default useChannelMessage;
