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
      <!--    存在回复对象-->
      <a-anchor-link
        v-if="messageItem.message.replay"
        :class="['replay-card', ]"
        :href="'#record:'+messageItem.message.replay?.msgID"
        :title="'@'+ messageItem.message.replay.username"
        @click="findRecordLight(messageItem.message.replay?.msgID)"
      >
        <template v-if="messageItem.message.replay.type===MessageTypeEnum.TEXT">
          <a-typography-paragraph
            :ellipsis="ellipsis"
            :copyable="true"
            :content="messageItem.message.replay.content "
          />
        </template>
        <!--    回复图片-->
        <template v-else-if="messageItem.message.replay.type===MessageTypeEnum.IMAGE">
          <a-image
            :width="100"
            :src="messageItem.message.replay.fileInfo.filePath"
            :alt="messageItem.message.replay.fileInfo.fileName"
          />
        </template>
      </a-anchor-link>

      <!-- TODO   消息体-->

      <template v-if="messageItem.message.type===MessageTypeEnum.TEXT">
        <a-typography-paragraph
          :class="['message-card', 'chat-bubble',isSend?'message-card-right': 'message-card-left']"
          :ellipsis="ellipsis"
          :copyable="true"
        >
          {{ messageItem.message.content }}
        </a-typography-paragraph>
      </template>
      <!--          文件类型-->
      <template v-else-if="messageItem.message.type===MessageTypeEnum.IMAGE">
        <a-image
          :width="200"
          :src="messageItem.message.fileInfo.filePath"
          :alt="messageItem.message.fileInfo?.fileName"
        />
      </template>
      <!--        回复-->
      <template v-else-if="messageItem.message.type===5">
        <a-typography-paragraph
          :class="['message-card', 'chat-bubble',isSend?'message-card-right': 'message-card-left']"
          :ellipsis="ellipsis"
          :copyable="true"
        >
          {{ messageItem.message.content }}
        </a-typography-paragraph>
      </template>

      <a-row
        v-if="isHovered"
        class="opt-box"
      >
        <!-- 使用 Tooltip 组件包裹需要悬浮显示的内容 -->
        <!--        <span-->
        <!--          class="opt"-->
        <!--          @click="Opt(messageItem,PushTypeEnum.THUMB_PUSH)"-->
        <!--        >-->
        <!--          <a-tooltip-->
        <!--            placement="topLeft"-->
        <!--            title="赞"-->
        <!--          >-->
        <!--            <like-filled v-show="messageItem.message.messageStatus?.userIsLike" />-->
        <!--            <like-outlined-->
        <!--              v-show="!messageItem.message.messageStatus?.userIsLike"-->
        <!--            />-->
        <!--          </a-tooltip>-->
        <!--        </span>-->
        <span class="opt">
          <a-tooltip
            placement="topLeft"
            title="回复"
          >
            <message-outlined @click="Opt(messageItem,PushTypeEnum.REPLAY_PUSH)" />
          </a-tooltip>
        </span>
      </a-row>

      <a-button
        v-if="isSend"
        size="small"
        type="link"
        style="color: #999999;font-size: 8px;float: right;height: 20px"
        @click="Opt(messageItem,PushTypeEnum.RECALL_PUSH)"
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
<script  setup lang="ts">
import dayjs from 'dayjs';
import { defineProps, ref, withDefaults } from 'vue';
import {
  MessageOutlined,
} from '@ant-design/icons-vue';
import { BaseRecord } from '@/types/channel';
import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';

const isHovered = ref(false);
withDefaults(defineProps<{
    isSend: boolean, // 是否是回复
    messageItem: BaseRecord // 消息体
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
const Opt = (message: BaseRecord, tp: number) => {
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
