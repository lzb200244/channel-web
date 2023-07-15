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
                  v-if="item.message.messageStatus?.isDrop"
                >
                  <div class="drop-record">
                    {{ item.message.content }}
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

      <div>
        <a-tag
          v-if="msg.message.replay"
          closable
          color="processing"
          @close="cancelReplay"
        >
          @ {{ msg.message.replay?.name }}
        </a-tag>
      </div>

      <channel-input
        ref="channelFocus"
        v-model:value="msg.message.content"
        :mention-list="onlineList"
        @send-message="sendMessage"
      />
    </div>
  </a-card>
</template>

<script setup lang="ts">

import { MessageType, PushMessage } from '@src/types/channel';
import useChannelMessage from '@/core/channel/channel-message';
import { MessageTypeEnum } from '@/types/channel/enum';
import ChannelCard from '@/components/channel/channelCard.vue';
import ChannelInput from '@/components/channel/channelInput.vue';
import useChannelStore from '@/store/channel';

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
} = useChannelMessage();

socket.onmessage = (event:any) => {
  let message: MessageType | PushMessage = JSON.parse(event.data);
  switch (message.type) {
    //   消息推送
    case MessageTypeEnum.MESSAGE_PUSH: {
      channelStore.pushRecordMessage(message as MessageType);
      break;
    }
    case MessageTypeEnum.ONLINE_PUSH: {
      channelStore.pushOnline(message as PushMessage);
      break;
    }
    case MessageTypeEnum.LEVEL_PUSH: {
      channelStore.popOnline(message as PushMessage);
      break;
    }
    // 撤销操作
    case MessageTypeEnum.DROP_PUSH: {
      channelStore.deleteRecord(message as MessageType);
      break;
    }
  }
  // 放入store
};

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
