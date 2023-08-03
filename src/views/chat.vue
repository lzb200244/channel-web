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

<style>
body{
    background-color: #ffffff;
}
.left {
    order: 1;
}

.middle {
    order: 2;
}

.right {
    order: 3;
}

@media (max-width: 992px) {
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

        @media (max-width: 600px) {
            width: 100%; /* 当屏幕缩小时，宽度占满 */
            min-height: 100%;

        }
    }
    @media (max-width: 600px) {
        width: 100%;
    }
}
.ant-card-body{
    padding: 0 10px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import ChannelTip from '@/components/channel/channelTip.vue';
import channelStatus from '@/components/channel/channelStatus.vue';
import channelMessage from '@/components/channel/channelMessage.vue';
import headerLayout from '@/components/layout/headerLayout.vue';

</script>
