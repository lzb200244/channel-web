<template>
  <a-card
    size="small"
    title="在线人数"
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
    //box-shadow: 0 2px 4px rgba(147, 127, 127, 0.1); border-bottom: 1px solid #efefef;
    }
}

/* 设置滚动条的宽度和高度 */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

/* 设置滚动条的背景颜色 */
::-webkit-scrollbar-track {
    background-color: #f1f1f1;
}

/* 设置滚动条thumb（滚动条上可拖动的部分）的背景颜色 */
::-webkit-scrollbar-thumb {
    background-color: #d0d0d0;
    border-radius: 5px;
    min-height: 50px;

}

/* 鼠标悬停在滚动条上时的样式 */
::-webkit-scrollbar-thumb:hover {
    background-color: #c7c7c7;
    border-radius: 5px;
}
</style>
