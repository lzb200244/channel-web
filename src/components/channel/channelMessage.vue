<template>
  <a-card
    size="small"
    style="height: 800px"
  >
    <template #title>
      <a-popover
        placement="topLeft"
      >
        <template #content>
          <room-desc
            v-once
            :room-info="roomInfo"
          />
        </template>
        <div style="font-size: 18px;cursor: pointer">
          {{ roomInfo.name }}
        </div>
      </a-popover>
    </template>

    <div class="chatroom-container">
      <div
        class="chatroom-messages"
        @scroll="LoadMoreRecord"
      >
        <div
          v-if="pageConf.isLoading && !pageConf.stop"
          style="text-align: center;color: #4ba8ff;position: absolute;"
        >
          <a-spin
            tip="Loading..."
            size="small"
          />
        </div>
        <a-skeleton
          v-for="i in 5"
          :key="i"
          :loading="reLoading"
          avatar
          :paragraph="{ rows: 2 }"
        />

        <dynamic-scroller
          v-show="!reLoading"
          :items="messageList"
          :min-item-size="60"
          style="height: 600px"
          class="virtual-list"
        >
          <template #default="{ item, index, active }">
            <dynamic-scroller-item
              :item="item"
              :active="active"
              :size-dependencies="[item.message.content]"
              :data-index="index"
            >
              <a-row
                :key="index"
              >
                <template
                  v-if="item.message.messageStatus.isDrop"
                >
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
                    @mention="handleMention"
                  />
                </template>
              </a-row>
            </dynamic-scroller-item>
          </template>
        </dynamic-scroller>
      </div>
      <div>
        <div style="position: relative">
          <a-tag
            v-if="msg.message.replay"
            style="position: absolute;bottom: 120px"
            closable
            color="processing"
            @close="cancelReplay"
          >
            @ {{ msg.message.replay?.username }}
          </a-tag>
          <a-tag
            style="position: absolute;bottom: 130px;right: 10px;cursor: pointer;border: 0"
            @click="scrollToBottom"
          >
            <caret-down-outlined />
          </a-tag>
          <channel-input
            v-model:value="msg.message.content"
            style="margin-bottom:  auto;"
            :is-login="user.isActive"
            @send-message="sendMessage"
            @mention="handleMention"
            @send-file-message="sendFileMessage"
          />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import useChannelMessage from '@/core/channel';
import ChannelCard from '@/components/channel/channelCard.vue';
import ChannelInput from '@/components/channel/channelInput.vue';
import roomDesc from '@/components/channel/room/roomInfo.vue';

const reLoading = inject('reLoading');
const {
  pageConf,
  user,
  msg,
  messageList,
  roomInfo,
  LoadMoreRecord,
  handleOpt,
  cancelReplay,
  sendMessage,
  sendFileMessage,
  handleMention,
  scrollToBottom,
} = useChannelMessage();

</script>

<style scoped>

.chatroom-container {

    width: 100%;
    margin: 0 auto;
    padding: 0 10px;
    height: 720px;

    .chatroom-messages {
        .virtual-list {
            scroll-behavior: smooth;
        }

        height: 600px;
        width: 100%;
        overflow-y: hidden;
        padding: 10px 2px;
        border-radius: 6px;

        .drop-record {
            text-align: center;
            font-size: 8px;
            color: #999999;
            width: 100%;
            padding: 15px;

        }
    }

}

</style>
