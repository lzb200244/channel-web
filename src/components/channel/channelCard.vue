<template>
  <a-row v-if="Object.keys(messageItem).length!==0">
    <a-col v-if="!isSend">
      <a-avatar
        :src="messageItem.user.avatar"
        :class="['message-avatar', 'avatar-left']"
      />
    </a-col>
    <div>
      <a-typography-text
        style="height: 22px"
        :class="['chat-info', isSend?'chat-info-right':'chat-info-left' ]"
      >
        <span class="chat-time">{{ formatTime(messageItem.message.time) }}</span>
        <span class="chat-name">{{ messageItem.user.name || messageItem.user.username }}</span>
      </a-typography-text>
      <a-typography-paragraph
        :class="['message-card', 'chat-bubble',isSend?'message-card-right': 'message-card-left']"
        :ellipsis="ellipsis"
        :copyable="true"
        :content="messageItem.message.content"
      />
      <a-button
        v-if="isSend"
        size="small"
        type="link"
        style="color: #999999;font-size: 8px;float: right"
        @click="Opt(messageItem.message,MessageTypeEnum.DROP_PUSH)"
      >
        撤回
      </a-button>
    </div>

    <a-col v-if="isSend">
      <a-avatar
        :src="messageItem.user.avatar"
        :class="['message-avatar', 'avatar-right']"
      />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';
import { defineProps, withDefaults } from 'vue';

import { MessageType, MessageItemType } from '@src/types/channel';
import { MessageTypeEnum } from '@/types/channel/enum';

withDefaults(defineProps<{
    isSend: boolean, // 是否是回复
    messageItem: MessageType // 消息体
}>(), {
  isSend: true,
});
/**
 * 操作：
 *  撤回，点赞，回复，@
 */
const emit = defineEmits(['opt']);

const ellipsis = {
  expandable: true,
  rows: 5,
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
const Opt = (message: MessageItemType, tp:number) => {
  //   判断是否过了两分钟
  //   发给父组件

  emit('opt', message, tp);
};
</script>
<style lang="scss" scoped>
.message-card {
  max-width: 200px;
  margin-top: 3px;
  margin-bottom: 0!important;
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
