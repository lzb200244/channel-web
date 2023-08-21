<template>
  <a-card
    style="height: 800px"
    size="small"
    :title="`在线人数 ${onlineList.length}人`"
    class="chat-status-list"
  >
    <!--在线成员-->
    <a-list
      v-if="onlineList.length!==0"
      item-layout="horizontal"
      :data-source="onlineList"
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
          <a-list-item-meta
            :class="{ 'slide-in-up': item.user.isActive, 'slide-out-down': !item.user.isActive }"
          >
            <template #title>
              {{ item.user.username }}
            </template>
            <template
              #avatar
            >
              <account-avatar
                :class="item.user.isActive?'avatar-online':'avatar-status'"
                :avatar="{src:item.user.avatar,username:item.user.username,length:1,size:35}"
              />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <!--离线成员-->
    <a-list
      v-if="offlineList.length!==0"
      item-layout="horizontal"
      :data-source="offlineList"
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
          <a-list-item-meta
            :class="{ 'slide-in-up': item.user.isActive, 'slide-out-down': !item.user.isActive }"
          >
            <template #title>
              {{ item.user.username }}
            </template>
            <template
              #avatar
            >
              <account-avatar
                :class="item.user.isActive?'avatar-online':'avatar-status'"
                :avatar="{src:item.user.avatar,username:item.user.username,length:1,size:35}"
              />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>
<script lang="ts" setup>
import {
  computed, inject, onMounted, ref,
} from 'vue';
import useChannelStore from '@/store/channel';
import { PushType } from '@/types/channel/modules/push';
import AccountAvatar from '@/components/account/accountAvatar.vue';

const first = ref(true);
const channelStore = useChannelStore();
const Loading = inject('Loading');
// 群成员
const offlineList = computed<PushType[]>(() => channelStore.onlineList.offline);
// 在线成员
const onlineList = computed<PushType[]>(() => channelStore.onlineList.online);
onMounted(() => {
  first.value = false;
});
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
.slide-in-up {
    animation: slideInUp 0.5s;
}

.slide-out-down {
    animation: slideOutDown 0.5s;
}
</style>
