<template>
  <a-row
    align="middle"
    class="chat-box"
    style="height: 100vh;margin: 0 auto"
  >
    <a-layout class="box">
      <a-layout-content>
        <a-row>
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="6"
            class="left"
          >
            <a-row :gutter="[5,5]">
              <a-col

                :xs="24"
                :sm="24"
                :md="24"
                :lg="5"
              >
                <header-layout />
              </a-col>
              <a-col
                :xs="24"
                :sm="24"
                :md="24"
                :lg="19"
              >
                <channel-tip />
              </a-col>
            </a-row>
          </a-col>
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="14"
            class="middle"
          >
            <channel-message />
          </a-col>
          <a-col
            :xs="0"
            :sm="0"
            :md="0"
            :lg="4"
            class="right"
          >
            <channel-status />
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-row>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
  computed, provide, ref, watchEffect,
} from 'vue';
import ChannelTip from '@/components/channel/channelTip.vue';
import channelStatus from '@/components/channel/channelStatus.vue';
import channelMessage from '@/components/channel/channelMessage.vue';
import headerLayout from '@/components/layout/headerLayout.vue';
import useChannelStore from '@/store/channel';
import WS from '@/utils/socket';
import { BaseRecord, ReplayMessage, ThumbMessage } from '@/types/channel';
import { PushTypeEnum } from '@/types/channel/enum';

const channel = useChannelStore();
const route = useRoute();
const router = useRouter();
const roomID = computed(() => <string>route.params.roomID ?? '0');
const Loading = ref(true);
provide('Loading', Loading);
let socket: WS;
const handleMessage = (data:BaseRecord<ReplayMessage>) => {
  let message = data;
  switch (message.type) {
    //  上线推送
    case PushTypeEnum.ONLINE_PUSH: {
      channel.pushOnline(message);
      break;
    }
    // 下线
    case PushTypeEnum.LEVEL_PUSH: {
      channel.popOnline(message);
      break;
    }
    //   消息推送
    case PushTypeEnum.MESSAGE_PUSH: {
      channel.pushRecordMessage(message);
      break;
    }
    // 回复
    case PushTypeEnum.REPLAY_PUSH: {
      channel.pushRecordMessage(message);
      break;
    }
    case PushTypeEnum.RECALL_PUSH: {
      channel.deleteRecord(message);
      break;
    }
    case PushTypeEnum.THUMB_PUSH:
      channel.updateRecordLikes(message as unknown as ThumbMessage);
      break;
  }
  // 放入store
};

// 监听房间ID的变化
watchEffect(() => {
  //   关闭旧的 socket 连接
  if (socket) socket.close();

  //   创建新的 socket 连接
  socket = new WS(`ws://127.0.0.1:8000/room/${roomID.value}/`);
  socket.connect();
  socket.onMessage(handleMessage);
  Promise.all([
    channel.getOnline(roomID.value),
    channel.getRoomInfo(roomID.value).catch(() => router.push('/')),
    channel.asyncRecord(1, roomID.value),
  ]).then(([onlineUsers, roomInfo, chatRecords]) => {
    //     请求成功
    Loading.value = false;
  }).catch((error) => {
    console.log(error);
    Loading.value = true;
  });
});

</script>
<style lang="scss" scoped>
$screen-md: 992px;
$screen-sm: 600px;

.left {
    order: 1;
}

.middle {
    order: 2;
}

.right {
    order: 3;
}

@media (max-width: $screen-md) {
    .left {
        order: 2;
    }

    .right {
        display: none;
    }
}

.chat-box {
    width: 80%;

    .box {
        border-radius: 10px;
        padding: 15px;
        min-height: 80%;

        @media (max-width: $screen-sm) {
            width: 100%;
            min-height: 100%;
        }
    }

    @media (max-width: $screen-sm) {
        width: 100%;
    }
}

.ant-card-body {
    padding: 0 10px;
}

</style>
