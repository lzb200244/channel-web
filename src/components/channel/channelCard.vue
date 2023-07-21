<template>
  <a-row
    v-if="Object.keys(messageItem).length!==0"
    :id="'record:'+messageItem.message.msgID"
    style="margin-bottom: 30px"
  >
    <!--      本人-->
    <a-col v-if="!isSend">
      <a-avatar
        :src="messageItem.user.avatar"
        :class="['message-avatar', 'avatar-left']"
      />
    </a-col>

    <a-dropdown :trigger="['contextmenu']">
      <div
        style="position: relative;"
        @mouseover="isHovered=true"
        @mouseleave="isHovered=false"
      >
        <a-typography-text
          style="height: 22px"
          :class="['chat-info', isSend?'chat-info-right':'chat-info-left' ]"
        >
          <span class="chat-time">{{ formatTime(messageItem.message.time) }}</span>
          <span class="chat-name">{{ messageItem.user.username }}</span>
        </a-typography-text>
        <!-- TODO   存在回复对象-->
        <a-anchor-link
          v-if="messageItem.message.replay"
          :class="['replay-card', ]"
          :href="'#record:'+messageItem.message.replay?.msgID"
          :title="'@'+ messageItem.message.replay.username"
          @click="findRecordLight(messageItem.message.replay.msgID)"
        >
          <template v-if="messageItem.message.replay.type ===MessageTypeEnum.TEXT">
            <a-typography-paragraph
              :ellipsis="ellipsis"
              :copyable="false"
              v-html="messageItem.message?.replay.content"
            />
          </template>
          <!--    回复图片-->
          <template v-else-if="messageItem.message?.replay.type===MessageTypeEnum.IMAGE">
            <a-image
              :width="100"
              :src="messageItem.message.replay?.fileInfo?.filePath"
              :alt="messageItem.message.replay?.fileInfo?.fileName"
            />
          </template>
        </a-anchor-link>

        <!-- TODO   消息体-->

        <template v-if="messageItem.message.type===MessageTypeEnum.TEXT">
          <a-typography-paragraph
            :class="['message-card',
                     'chat-bubble',isSend?'message-card-right': 'message-card-left']"
            :ellipsis="ellipsis"
            :copyable="false"
            v-html="messageItem.message.content"
          />
        </template>
        <!--          文件类型-->
        <template v-else-if="messageItem.message.type===MessageTypeEnum.IMAGE">
          <a-image
            :width="200"
            :src="messageItem.message.fileInfo?.filePath"
            :alt="messageItem.message.fileInfo?.fileName"
          />
        </template>
        <!--        回复-->
        <template v-else-if="messageItem.message.type===5">
          <a-typography-paragraph
            :class="['message-card',
                     'chat-bubble',isSend?'message-card-right': 'message-card-left']"
            :ellipsis="ellipsis"
            :copyable="false"
            v-html="messageItem.message.content"
          />
        </template>

        <a-row
          v-if="isHovered"
          class="opt-box"
        >
          <span class="opt">
            <a-tooltip
              placement="topLeft"
              title="回复"
            >
              <message-outlined @click="Opt(messageItem,PushTypeEnum.REPLAY_PUSH)" />
            </a-tooltip>
          </span>
          <span class="opt">

            <a-tooltip
              placement="topLeft"
              title="点赞"
            >
              <like-outlined

                :class="{star:messageItem.message.messageStatus.isLike===true}"
                @click="likeStatus(messageItem,true)"
              />
            </a-tooltip>
          </span>
          <span class="opt">
            <a-tooltip
              placement="topLeft"
              title="踩"
            >
              <dislike-outlined
                :class="{star:messageItem.message.messageStatus.isLike===false}"
                @click="likeStatus(messageItem,false)"
              />
            </a-tooltip>
          </span>
        </a-row>
      </div>

      <template #overlay>
        <a-menu>
          <a-menu-item key="copy">
            <a-button
              size="small"
              type="text"
              style="font-size: 12px;"
              @click="copyUrl(messageItem.message.content as string)"
            >
              <copy-outlined />复 制
            </a-button>
          </a-menu-item>
          <a-menu-item key="call">
            <a-button
              size="small"
              type="text"
              style="font-size: 12px;"
              @click="mentionUser(messageItem)"
            >
              @ 艾特Ta
            </a-button>
          </a-menu-item>

          <a-menu-item
            key="recall"
            style="border-top: 1px solid #d7d7d7;"
          >
            <a-button
              v-if="isSend"
              size="small"
              type="text"
              style="font-size: 12px;"
              @click="Opt(messageItem,PushTypeEnum.RECALL_PUSH)"
            >
              <delete-outlined />撤 回
            </a-button>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <a-col v-if="isSend">
      <a-avatar
        :src="messageItem.user.avatar"
        :class="['message-avatar', 'avatar-right']"
      />
    </a-col>
  </a-row>
</template>
<script  setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import {
  MessageOutlined, DeleteOutlined, CopyOutlined, LikeOutlined, DislikeOutlined,
} from '@ant-design/icons-vue';
import {
  BaseRecord, ReplayMessage,
} from '@/types/channel';

import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';

const isHovered = ref(false);
// defineProps<{
//     isSend: boolean, // 是否是回复
//     messageItem: BaseRecord<ReplayMessage> // 消息体
// }>(), {
//   isSend: true,
// };

defineProps({
  isSend: {
    type: Boolean,
    default: () => true,
  },
  messageItem: {
    type: Object as ()=> BaseRecord<ReplayMessage>,
    required: true,
  },
});
/**
 * 操作：
 *  撤回，点赞，回复，@
 */
const emit = defineEmits(['opt']);
const ellipsis = {
  expandable: true,
  rows: 3,
  symbol: '更多',
};

const oneDayTimestamp = 24 * 60 * 60 * 1000; // 一天的时间戳，单位为毫秒
/**
 * 判断是否前一天以上,
 * @param timestamp 时间戳
 */
const formatTime = (timestamp: number) => (timestamp + oneDayTimestamp < Date.now()
  ? dayjs(timestamp).format('MM月DD日 HH:mm')
  : dayjs(timestamp).format('HH:mm'));

/**
 *
 * @param message 消息id
 * @param tp 操作类型
 */
const Opt = (message: BaseRecord<ReplayMessage>, tp: number) => {
  //   判断是否过了两分钟
  //   发给父组件

  emit('opt', message, tp);
};
/**
 * 点击@是进行语法高亮
 *
 */
const findRecordLight = (id: number) => {
  let domID = `record:${id}`;
  // let dom = document.getElementById(domID);
  // console.log(dom);
  // dom.style.background = 'red';
};

/**
 * @ 某人
 */
const mentionUser = (message: BaseRecord<ReplayMessage>) => {
  console.log(message);
};
/**
 * 复制1内容
 * @param content
 */
const copyUrl = (content:string) => {
  const input = document.createElement('input'); // js创建一个input输入框
  input.value = content; // 将需要复制的文本赋值到创建的input输入框中
  document.body.appendChild(input); // 将输入框暂时创建到实例里面
  input.select(); // 选中输入框中的内容
  document.execCommand('Copy'); // 执行复制操作
  document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
};
/**
 * likeStatus 点赞与取消
 */
const likeStatus = (item: BaseRecord<ReplayMessage>, isLike:boolean) => {
  item.message.messageStatus.isLike = isLike;
};
</script>
<style lang="scss" scoped>
.replay-card {
  max-width: 200px;
  margin-top: 3px;
  margin-bottom: 0 !important;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;
  border-radius: 0 7px 7px 0;
  border-left: 5px solid #dadada;
}

.message-card {

  max-width: 200px;
  margin-top: 3px;
  margin-bottom: 0 !important;
  padding: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0, rgba(0, 0, 0, 0.06) 0 1px 2px 0;
  border-radius: 7px;

  &.message-card-left {
    background-color: #f0f0f0;
    color: #7c7c7c;
    border-top-left-radius: 0;
  }

  &.message-card-right {
    background-color: #6495ed;
    color: white;
    border-top-right-radius: 0;
  }
}

.opt {
  cursor: pointer;
  margin-right: 8px;
  .star{
  color: #379dff;
  }
}

.opt-box {
  padding: 0 3px;
  position: absolute;
  left: 0;
  //margin-top: 8px;

  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.16); /* 添加阴影效果 */
}

.chat-info {
  display: flex;
  justify-content: start;
  margin-left: 10px;

  &-right {
    justify-content: end;
    margin-right: 10px;
  }

  .chat-time {
    margin-right: 5px;
    color: #999;
    line-height: 22px;
    font-size: 10px;
  }

  .chat-name {
    color: #666;
    line-height: 22px;
    font-size: 12px;
  }
}

.chat-bubble {
  padding: 10px;
  border-radius: 20px;
  margin: 10px;

  &.chat-bubble-left {
    background-color: #f0f0f0;
    color: #7c7c7c;
  }

  &.chat-bubble-right {
    background-color: #6495ed;
    color: white;
  }
}

.message-avatar {

  margin: 10px;

  &.avatar-left {
    margin-left: 10px;
    float: left;
  }

  &.avatar-right {
    margin-right: 10px;
    float: right;
  }
}

</style>
