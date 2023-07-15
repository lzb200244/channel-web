<template>
  <a-card
    size="small"
    :title="`在线人数 ${onlineList.length}人`"
  >
    <a-list
      class="chat-status-list"
      :loading="onlineList.length===0"

      item-layout="horizontal"
      :data-source="onlineList"
    >
      <template #renderItem="{ item }">
        <a-list-item class="chat-status-item">
          <a-skeleton
            avatar
            :title="false"
            :loading="!item.message"
            active
          >
            <a-list-item-meta>
              <template #title>
                <a href="#">{{ item.message.name }}</a>
              </template>
              <template
                #avatar
              >
                <a-avatar
                  :src="item.message.avatar"
                  :size="35"
                  :class="item.message.isActive?'avatar-online':'avatar-status'"
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
import useChannelStore from '@/store/channel';

const channelStore = useChannelStore();
const onlineList = computed(() => channelStore.onlineList);
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
