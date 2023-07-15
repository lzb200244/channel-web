import {
  computed,
  nextTick, onMounted, onUnmounted, reactive, ref,
} from 'vue';
import { message } from 'ant-design-vue';
import { MessageType } from '@src/types/channel';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { getRecordAPi } from '@/apis/channel';
import useChannelStore from '@/store/channel';
import useAccountStore from '@/store/account';
import { MessageContentEnum, MessageTypeEnum } from '@/types/channel/enum';
import isTimeElapsed from '@/utils/elapsed';

export default () => {
  let virtual: HTMLElement;
  const channelStore = useChannelStore();
  const accountStore = useAccountStore();
  const route = useRoute();
  const socket = new WebSocket(`ws://127.0.0.1:8000/room/${route.params.room ?? 0}/`);
  // 请求聊天记录
  channelStore.asyncRecord();
  /**
     * 当前在线
     */
  const onlineList = computed(() => channelStore.onlineList);
  /**
     * 聊天记录，进行翻转
     */
  const messageList = computed(() => channelStore.messageList.map((item:MessageType, idx:number) =>
    ({ ...item, id: idx + 1 }), // 使用展开语法创建一个新对象，添加唯一ID
  ).reverse());
    /**
     * 当前用户
     */
  const user = computed(() => accountStore.user);
  const channelFocus = ref();

  // 当前页数
  const pageConf = reactive({
    isLoading: false,
    currentPage: 1,
    stop: false,
  });

  const msg = reactive<MessageType>({
    type: MessageTypeEnum.MESSAGE_PUSH,
    message: {
      content: '',
      time: Date.now(),
      type: MessageContentEnum.MSG,
      messageStatus: {
        dislikeCount: 0,
        likeCount: 0,
        userIsLike: false,
        isDrop: false,
      },
      msgID: 0,
    },
    user: {
      userID: user.value.userID,
    },
  } as MessageType);
  /**
     * 滑动到底部
     */
  const scrollToBottom = () => {
    virtual.scrollTop = virtual.scrollHeight;
  };

  /**
     * 加载更多数据
     * @constructor
     */
  const LoadMoreRecord = async () => {
    const { scrollTop } = virtual;
    if (scrollTop === 0 && !pageConf.isLoading) {
      pageConf.isLoading = true;
      getRecordAPi(++pageConf.currentPage, 0).then((res: any) => {
        setTimeout(() => {
          channelStore.asyncPushMoreRecord(res.data.results);
          pageConf.isLoading = false;
        }, 500);
        // virtual.scrollTop = 20;
      }).catch(() => {
        message.info('已经到达最顶了');
        pageConf.isLoading = true;
        pageConf.stop = true;
      });
    }
  };
  const handleOpt = (obj: MessageType, tp: number) => {
    switch (tp) {
      case MessageTypeEnum.DROP_PUSH: {
        if (isTimeElapsed(obj.message.time, 2)) {
          message.warn('暂时不支持超过两分钟的撤回');
          return;
        }
        // 删除本地撤回的

        // channelStore.deleteRecord(obj.message.msgID);
        obj.message.content = ` ${dayjs(`${new Date()} `).format('HH:mm')} ${user.value.username} 撤回了一条消息`;
        // 表记为已经撤销
        if (obj.message.messageStatus) {
          obj.message.messageStatus.isDrop = true;
        }
        // 通知其它chat，撤回
        const itm: MessageType = {
          type: MessageTypeEnum.DROP_PUSH,
          message: obj.message,
          user: user.value,
        };
        socket.send(JSON.stringify(itm));
        break;
      }
      case MessageTypeEnum.THUMB_PUSH: {
        if (obj.message.messageStatus) {
          obj.message.messageStatus.userIsLike = !obj.message.messageStatus.userIsLike;
          obj.message.messageStatus.likeCount++;
        }
        break;
      }
      // TODO 回复
      case MessageTypeEnum.REPLAY_PUSH: {
      // 1.构造回复体
        msg.message.replay = {
          userID: user.value.userID,
          name: user.value.name,
          content: obj.message.content,
          msgID: obj.message.msgID,
        };
        msg.type = MessageTypeEnum.REPLAY_PUSH;
        // TODO 2. 聚焦
        channelFocus.value.focus();

        break;
      }
    }
  };
  const handleMentions = (str: string): string => str.replace(/@([^ ]+)/g, '<span class="mention">@$1</span>');
  const cancelReplay = () => {
    msg.message.replay = undefined;
  };

  /**
     * 发送消息
     */
  const sendMessage = (v:string) => {
    // 匿名用户

    if (!user.value.userID || !v) return;
    //   消息类型
    msg.message.type = MessageContentEnum.MSG;
    msg.type = MessageTypeEnum.MESSAGE_PUSH;
    msg.user = user.value;
    msg.message.content = handleMentions(v);

    let parse = JSON.stringify(msg);
    socket.send(parse);
    msg.message.content = '';
    setTimeout(() => {
      // 延迟一段时间再滚动到底部
      scrollToBottom();
    }, 200); // 可根据实际情况调整延迟时间
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
    onlineList,
    messageList,
    msg,
    user,
    channelFocus,
    LoadMoreRecord,
    handleOpt,
    cancelReplay,
    sendMessage,
  };
};
