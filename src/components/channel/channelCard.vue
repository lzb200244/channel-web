<template>
  <a-row
    v-if="Object.keys(messageItem).length!==0"
    :id="'record:'+messageItem.message.msgID"
    style="margin-bottom: 5px"
    class="hover"
  >
    <a-dropdown :trigger="['contextmenu']">
      <a-comment style="padding-right: 10px;">
        <template #actions>
          <span key="comment-basic-like">
            <a-tooltip title="Like">
              <template v-if="messageItem.message.messageStatus.isLike===1">
                <LikeFilled @click="LikeStatus(messageItem,1)" />
              </template>
              <template v-else>
                <LikeOutlined @click="LikeStatus(messageItem,1)" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">
              999+
            </span>
          </span>
          <span key="comment-basic-dislike">
            <a-tooltip title="Dislike">
              <template v-if="messageItem.message.messageStatus.isLike===2">
                <DislikeFilled @click="LikeStatus(messageItem,2)" />
              </template>
              <template v-else>
                <DislikeOutlined @click="LikeStatus(messageItem,2)" />
              </template>
            </a-tooltip>
            <span style="padding-left: 8px; cursor: auto">
              111
            </span>
          </span>
          <span
            key="comment-basic-reply-to"
            @click="Opt(messageItem,PushTypeEnum.REPLAY_PUSH)"
          >Reply to</span>
        </template>
        <template #author>
          <a
            :class="isSend?'isSend':''"
            style="font-size: 14px;"
          >{{ userMap.get(messageItem.user.userID)?.username }}</a>
        </template>
        <template #avatar>
          <a-avatar
            :src="userMap.get(messageItem.user.userID)?.avatar"
            :alt="userMap.get(messageItem.user.userID)?.username "
          />
        </template>
        <template #content>
          <div
            style="position: relative;margin-top: 20px"
          >
            <!-- TODO   存在回复对象-->
            <a-anchor-link
              v-if="messageItem.message.replay"
              class="replay"
              :href="'#record:'+messageItem.message.replay.msgID"
              :title="'@'+ messageItem.message.replay.username"
              @click="findRecordLight(messageItem.message.replay.msgID)"
            >
              <template v-if="messageItem.message.replay.type ===MessageTypeEnum.TEXT">
                <a-typography-paragraph
                  v-html="messageItem.message?.replay.content"
                />
              </template>
              <!--    回复图片-->
              <template v-else-if="messageItem.message?.replay.type===MessageTypeEnum.IMAGE">
                <record-img
                  :style="{maxWidth:'220px'}"
                  :file-info="messageItem.message.fileInfo"
                />
              </template>
              <template v-else-if="messageItem.message.type===MessageTypeEnum.FILE">
                <record-file :file-info="messageItem.message.fileInfo" />
              </template>
            </a-anchor-link>
            <!-- TODO   消息体-->
            <template v-if="messageItem.message.type===MessageTypeEnum.TEXT">
              <a-typography-paragraph
                v-html="messageItem.message.content"
              />
            </template>
            <!--          图片类型-->
            <template v-else-if="messageItem.message.type===MessageTypeEnum.IMAGE">
              <record-img
                :style="{maxWidth:'320px'}"
                :file-info="messageItem.message.fileInfo"
              />
            </template>
            <template v-else-if="messageItem.message.type===MessageTypeEnum.FILE">
              <record-file :file-info="messageItem.message.fileInfo" />
            </template>
          </div>
        </template>

        <template #datetime>
          <a-tooltip :title="dayjs(messageItem.message.time).format('YYYY-MM-DD HH:mm:ss')">
            <span>{{ formatTime(messageItem.message.time) }}</span>
          </a-tooltip>
        </template>
      </a-comment>
      <template #overlay>
        <a-menu>
          <a-menu-item key="copy">
            <a-button
              size="small"
              type="text"
              style="font-size: 12px;"
              @click="copyUrl(messageItem.message.content as string)"
            >
              <copy-outlined />
              复 制
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
          >
            <a-button
              v-if="isSend"
              size="small"
              type="text"
              style="font-size: 12px;"
              @click="Opt(messageItem,PushTypeEnum.RECALL_PUSH)"
            >
              <delete-outlined />
              撤 回
            </a-button>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-row>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { computed } from 'vue';
import {
  CopyOutlined, DeleteOutlined, DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined,
} from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BaseRecord, ReplayMessage, likeStatus } from '@/types/channel';

import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { thumbAPI } from '@/apis/channel';
import useChannelStore from '@/store/channel';
import RecordFile from '@/components/channel/record/recordFile.vue';
import RecordImg from '@/components/channel/record/recordImg.vue';

dayjs.extend(relativeTime);

defineProps({
  //   是否是回复
  isSend: {
    type: Boolean,
    default: () => true,
  },
  messageItem: {
    //   消息体
    type: Object as () => BaseRecord<ReplayMessage>,
    required: true,
  },
});
/**
 * 操作：
 *  撤回，点赞，回复，@
 */
const emit = defineEmits(['opt']);
const channelStore = useChannelStore();
const userMap = computed(() => channelStore.userMap);

const oneDayTimestamp = 24 * 60 * 60 * 1000; // 一天的时间戳，单位为毫秒
/**
 * 判断是否前一天以上,
 * @param timestamp 时间戳
 */
const formatTime = (timestamp: number) => (timestamp + oneDayTimestamp < Date.now()
  ? dayjs(timestamp).format('MM月DD日 HH:mm')
  : dayjs(timestamp).format('HH:mm')
);

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
  console.log(domID);
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
const copyUrl = (content: string) => {
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
const LikeStatus = async (item: BaseRecord<ReplayMessage>, isLike: likeStatus) => {
  //   如果重复操作返回
  if (item.message.messageStatus.isLike === isLike) return;
  item.message.messageStatus.isLike = isLike;
  await thumbAPI({
    type: PushTypeEnum.THUMB_PUSH,
    message: { msgID: item.message.msgID, isLike },
  });
};
</script>
<style lang="scss">
.replay {
  border-left: rgba(255, 231, 209, 0.9) 5px solid;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  margin-bottom: 15px;

}

.isSend {
  font-weight: bolder;
  color: #494949!important;
}
.hover:hover{
  background-color: #fff0f0;
  transition: all .4s ease-in-out
}

</style>
