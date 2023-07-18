<template>
  <a-card
    size="small"
    :title="`在线人数 ${onlineList.length}人`"
  >
    <a-list
      class="chat-status-list"
      :loading="memberList.length===0"

      item-layout="horizontal"
      :data-source="memberList"
    >
      <template #renderItem="{ item }">
        <a-list-item class="chat-status-item">
          <a-skeleton
            avatar
            :title="false"
            :loading="!item.user"
            active
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
          </a-skeleton>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

import { PushType } from '@/types/t/push';
import useChannelStore from '@/store/channel';

const channelStore = useChannelStore();
// 群成员
const memberList = computed<PushType[]>(() => channelStore.onlineList);
// 在线成员
const onlineList = computed<PushType[]>(() => channelStore.onlineList.filter((item:PushType) =>
  item.user.isActive));
const onLoadMore = () => {
  console.log(1);
};
channelStore.getOnline();
</script>
<style scoped>

.chat-status-list {
    height: 680px;

    overflow-y: auto;

    .chat-status-item {
        padding: 8px;
    //box-shadow: 0 2px 4px rgba(147, 127, 127, 0.1); border-bottom: 1px solid #efefef;
    }

    .avatar-online {
        position: relative;
        display: inline-block;

        &::after {
            content: "";
            position: absolute;
            bottom: 3px;
            right: 5px;
            width: 8px;
            height: 8px;
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
