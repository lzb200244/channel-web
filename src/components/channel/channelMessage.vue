<template>
  <a-card size="small">
    <div class="chatroom-container">
      <div
        class="chatroom-messages"
        @scroll="LoadMoreRecord"
      >
        <div
          v-if="pageConf.isLoading && !pageConf.stop"

          style="text-align: center;color: #4ba8ff"
        >
          <a-spin
            tip="Loading..."
            size="small"
          />
        </div>

        <DynamicScroller
          :items="messageList"
          :min-item-size="65"
          style="height: 650px"
          class="virtual-list"
        >
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :size-dependencies="[item.message.content]"
              :data-index="index"
            >
              <a-row
                :key="index"
                :justify="item.user?.userID===user.userID?'end':'start'"
              >
                <template
                  v-if="item.message.messageStatus.isDrop"
                >
                  <!--v-if="item.message.type===MessageTypeEnum.TEXT"-->
                  <div
                    class="drop-record"
                  >
                    {{ item.message.messageStatus.drop }}
                  </div>
                </template>
                <template v-else>
                  <channel-card
                    :message-item="item"
                    :is-send="item.user?.userID===user.userID"
                    @opt="handleOpt"
                  />
                </template>
              </a-row>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </div>
      <div style="position: relative">
        <a-tag
          v-if="msg.message.replay"
          style="position: absolute;bottom: 55px"
          closable
          color="processing"
          @close="cancelReplay"
        >
          @ {{ msg.message.replay?.username }}
        </a-tag>

        <channel-input
          ref="channelFocus"
          v-model:value="msg.message.content"
          :is-login="user.isActive"
          :mention-list="onlineList"
          @send-message="sendMessage"
          @send-file-message="sendFileMessage"
        />
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import useChannelStore from '@/store/channel';
import useChannelMessage from '@/core/channel';
import { PushTypeEnum } from '@/types/channel/enum';
import ChannelCard from '@/components/channel/channelCard.vue';
import ChannelInput from '@/components/channel/channelInput.vue';

import { BaseRecord } from '@/types/channel';

const channelStore = useChannelStore();
const {
  pageConf,
  user,
  msg,
  socket,
  channelFocus,
  onlineList,
  messageList,
  LoadMoreRecord,
  handleOpt,
  cancelReplay,
  sendMessage,
  sendFileMessage,
} = useChannelMessage();

socket.onMessage((data:BaseRecord) => {
  let message:BaseRecord = data;
  switch (message.type) {
    //  上线推送
    case PushTypeEnum.ONLINE_PUSH: {
      channelStore.pushOnline(message);
      break;
    }
    // 下线
    case PushTypeEnum.LEVEL_PUSH: {
      channelStore.popOnline(message);
      break;
    }
    //   消息推送
    case PushTypeEnum.MESSAGE_PUSH: {
      channelStore.pushRecordMessage(message);
      break;
    }
    // 回复
    case PushTypeEnum.REPLAY_PUSH: {
      channelStore.pushRecordMessage(message);
      break;
    }
    case PushTypeEnum.RECALL_PUSH: {
      channelStore.deleteRecord(message);
      break;
    }
  }
  // 放入store
});

</script>

<style scoped>

.chatroom-container {

    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
//background-color: #f2f2f2;

    .chatroom-messages {
        .virtual-list {
            scroll-behavior: smooth;
        }

        height: 650px;
        width: 100%;
        overflow-y: hidden;
        padding: 10px 2px;
        border-radius: 6px;
    //box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        .drop-record {
            text-align: center;
            font-size: 8px;
            color: #999999;
            width: 100%;
            padding: 15px;

        }
    }

    .chatroom-input {

        display: flex;
        width: 100%;
        margin-top: 20px;

        .chat-textarea {
            resize: none; /* 禁止用户手动调整大小 */
            overflow: hidden; /* 隐藏溢出的内容 */
            min-height: 50px; /* 设置textarea的最小高度 */
            height: auto;
            padding: 0;

        }

        input {
            flex-grow: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
    }
}

</style>
