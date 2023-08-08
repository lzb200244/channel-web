<template>
  <a-card
    style="height: 800px"
    size="small"
    :title="`在线人数 ${onlineList.length}人`"
  >
    <a-list
      class="chat-status-list"
      item-layout="horizontal"
      :data-source="memberList"
    >
      <template #renderItem="{ item }">
        <a-skeleton
          avatar
          :title="false"
          :loading="Loading"
          active
        />
        <a-list-item
          v-if="!Loading"
          class="chat-status-item"
        >
          <a-list-item-meta>
            <template #title>
              <a href="#">{{ item.user.username }}</a>
            </template>
            <template
              #avatar
            >
              <a-avatar
                :src="item.user.avatar"
                :size="35"
                :class="item.user.isActive?'avatar-online':'avatar-status'"
              />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script lang="ts" setup>
import { computed, inject } from 'vue';
import useChannelStore from '@/store/channel';
import { PushType } from '@/types/channel/modules/push';

const channelStore = useChannelStore();
const Loading = inject('Loading');
// 群成员
const memberList = computed<PushType[]>(() => channelStore.onlineList);
// 在线成员
const onlineList = computed<PushType[]>(() => channelStore.onlineList.filter((item:PushType) =>
  item.user.isActive));

</script>
<style scoped>

.chat-status-list {
    height: 680px;
    overflow-y: auto;
    .chat-status-item {
        padding: 8px;
    }
    .avatar-online {
        position: relative;
        display: inline-block;
        &::after {
            content: "";
            position: absolute;
            bottom: 1px;
            right: 2px;
            width: 10px;
            height: 10px;
            background-color: #b8ff79;
            border-radius: 50%;
        }

    }
    .avatar-status {
        position: relative;
        display: inline-block;
        &::after {
            content: "";
            position: absolute;
            bottom: 3px;
            right: 5px;
            width: 8px;
            height: 8px;
            background-color: #bbbbbb;
            border-radius: 50%;
        }
    }
}

</style>
