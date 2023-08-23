<template>
  <a-card
    size="small"
    class="h-800px"
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
        <div
          class="text-lg cursor-pointer"
        >
          {{ roomInfo.name }}
        </div>
      </a-popover>
    </template>

    <div class="w-full my-auto py-10px h-720px">
      <div
        class="rounded-sm  h-600px w-full overflow-y-hidden  "
        @scroll="LoadMoreRecord"
      >
        <div
          v-if="pageConf.isLoading && !pageConf.stop"
          class=" absolute right-10"
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
          class="virtual-list scroll-smooth  h-600px"
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
                    class="text-center w-full text-xs text-gray-400 py-15px"
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
        <div class="relative">
          <a-tag
            v-if="msg.message.replay"
            closable
            class="absolute bottom-120px"
            color="processing"
            @close="cancelReplay"
          >
            @ {{ msg.message.replay?.username }}
          </a-tag>
          <a-tag
            style="border: none;position: absolute"
            class=" bottom-140px right-10px cursor-pointer  "

            @click="scrollToBottom"
          >
            <caret-down-outlined />
          </a-tag>
          <channel-input
            v-model:value="msg.message.content"
            class="mb-auto"
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
import useChannelStoreMessage from '@/core/channel';
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
} = useChannelStoreMessage();

</script>
