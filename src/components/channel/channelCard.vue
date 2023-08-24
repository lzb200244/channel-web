<template>
  <a-row
    v-if="Object.keys(messageItem).length!==0"

    :id="'record:'+messageItem.message.msgID"
    class="hover w-full"
  >
    <a-dropdown :trigger="['contextmenu']">
      <a-comment
        class="w-full pr-5"
      >
        <template #actions>
          <span key="comment-basic-like">
            <a-tooltip title="Like">
              <template v-if="messageItem.message.messageStatus.members.includes(user.userID)">
                <LikeFilled />
              </template>
              <template v-else>
                <LikeOutlined @click="likeStatus(messageItem,true)" />
              </template>
            </a-tooltip>
            <span
              class="pl-3 cursor-auto"
            >
              {{ messageItem.message.messageStatus.likes }}
            </span>
          </span>
          <span key="comment-basic-dislike">
            <a-tooltip title="Dislike">
              <template
                v-if="messageItem.message.messageStatus.members.includes(user.userID)"
              >
                <span @click="likeStatus(messageItem,false)">取消点赞</span>
              </template>
            </a-tooltip>

          </span>
          <span
            key="comment-basic-reply-to"
            @click="Opt(messageItem,PushTypeEnum.REPLAY_PUSH)"
          >回 复</span>

          <span
            v-if="messageItem.message.messageStatus.members.length!==0"
            class="absolute right-20 bottom-6"
          >
            <record-thumb :members="messageItem.message.messageStatus.members" />
          </span>
        </template>
        <template #author>
          <a-popover>
            <template #content>
              <account-card :user-info="userMap?.get(messageItem.user.userID)" />
            </template>
            <a
              :class="{isSend:isSend}"
            >{{ userMap?.get(messageItem.user.userID)?.username }}</a>
          </a-popover>
        </template>
        <template #avatar>
          <account-avatar
            :avatar="{
              src:userMap?.get(messageItem.user.userID)?.avatar,
              username:userMap?.get(messageItem.user.userID)?.username,
              length:1
            }"
          />
        </template>
        <template #content>
          <div
            class="relative mt-5"
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
                  class="max-w-220px"
                  :file-info="messageItem.message.replay.fileInfo"
                />
              </template>
              <template v-else-if="messageItem.message?.replay.type===MessageTypeEnum.FILE">
                <record-file :file-info="messageItem.message.replay.fileInfo" />
              </template>
            </a-anchor-link>
            <!-- TODO   消息体-->
            <template
              v-if="messageItem.message.type===MessageTypeEnum.TEXT "
            >
              <a-typography-paragraph
                v-html="messageItem.message.content"
              />
            </template>
            <!--          图片类型-->
            <template v-else-if="messageItem.message.type===MessageTypeEnum.IMAGE">
              <record-img
                class="max-w-320px"
                :file-info="messageItem.message.fileInfo"
              />
            </template>
            <template v-else-if="messageItem.message.type===MessageTypeEnum.FILE">
              <record-file :file-info="messageItem.message.fileInfo" />
            </template>
            <template v-else-if="messageItem.message.type===MessageTypeEnum.GPT">
              <record-text :content="messageItem.message.content" />
            </template>
          </div>
        </template>

        <template #datetime>
          <a-tooltip :title="dayjs(messageItem.message.time).format('YYYY-MM-DD HH:mm:ss')">
            <span>{{ formatTime(messageItem.message.time) }}</span>
          </a-tooltip>
          <a-tag
            v-if="messageItem.user.userID===roomInfo?.creator?.userID"
            color="green"
            style="margin-left: 5px;"
          >
            群主
          </a-tag>
          <a-tag
            v-if="isSend"
            color="blue"
          >
            自己
          </a-tag>
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
  CopyOutlined, DeleteOutlined, LikeFilled, LikeOutlined,
} from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRoute } from 'vue-router';
import { BaseRecord, ReplayMessage } from '@/types/channel';
import { MessageTypeEnum, PushTypeEnum } from '@/types/channel/enum';
import { sendThumbActionAsync } from '@/apis/channel';

import useAccount from '@/store/account';
import RecordFile from '@/components/channel/record/recordFile.vue';
import RecordImg from '@/components/channel/record/recordImg.vue';
import AccountCard from '@/components/account/accountCard.vue';
import AccountAvatar from '@/components/account/accountAvatar.vue';
import RecordText from '@/components/channel/record/recordText.vue';
import RecordThumb from '@/components/channel/record/recordThumb.vue';
import useChannelStore from '@/store/channel';

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
const useChannel = useChannelStore();
const emit = defineEmits(['opt', 'mention']);

const route = useRoute();
const roomID = computed(
  () => (Number.isNaN(Number(route.params.roomID)) ? 1 : Number(route.params.roomID)),
);
const oneDayTimestamp = 24 * 60 * 60 * 1000; // 一天的时间戳，单位为毫秒
const userStore = useAccount();
const user = computed(() => userStore.user);

const roomInfo = computed(() => useChannel.getRoomInfoByRoomID(roomID.value));
const userMap = computed(() => {
  const userInfo = useChannel.getUserByRoomID(roomID.value);
  if (userInfo) {
    return userInfo;
  }
  return new Map();
});
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
 * LikeStatus 点赞与取消
 */
const likeStatus = async (item: BaseRecord<ReplayMessage>, status: boolean) => {
  //   如果重复操作返回
  // if (item.message.messageStatus.members.includes(user.value.userID)) return;
  if (status) {
    item.message.messageStatus.members.push(user.value.userID);
    item.message.messageStatus.likes += 1;
  } else {
    // 删除
    item.message.messageStatus.members = item.message.messageStatus.members.filter(
      (id) => id !== user.value.userID,
    );
    item.message.messageStatus.likes -= 1;
  }
  await sendThumbActionAsync({
    type: PushTypeEnum.THUMB_PUSH,
    message: { msgID: item.message.msgID },
    roomID: roomID.value,
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
  color: #494949 !important;
}

.hover:hover {
  background-color: #fff0f0;
  transition: all .4s ease-in-out
}

</style>
