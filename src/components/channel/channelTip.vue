<template>
  <a-card class="h-800px overflow-y-auto">
    <a-layout-content>
      <a-collapse
        v-model:activeKey="activeKey"
        style="border: none;"
        expand-icon-position="left"
      >
        <template #expandIcon="{ isActive }">
          <caret-right-outlined :rotate="isActive ? 90 : 0" />
        </template>
        <a-collapse-panel
          key="person"

          style="border: none;"
          :show-arrow="true"
          header="个人消息"
        >
          <a-list
            class="m-h-300px"
            item-layout="horizontal"
            :data-source="rooms.private_rooms"
          >
            <template
              v-if="!Loading"
              #renderItem="{ item }"
            >
              <a-list-item>
                <a-list-item-meta
                  :description="item.desc"
                >
                  <template #title>
                    <router-link :to="'/room/'+item.id">
                      {{ item.name }}
                    </router-link>
                  </template>
                  <template #avatar>
                    <account-avatar
                      :avatar="{src:item.avatar,username:item.name,shape:'square',size:40,length:4}"
                    />
                  </template>
                </a-list-item-meta>
                <span
                  class="text-gray-400 text-sm"
                >
                  {{ new Date().getHours() + ':' + new Date().getMinutes() }}
                </span>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>
        <a-collapse-panel
          key="group"
          style="border: none;"
          :show-arrow="true"
          header="群消息"
        >
          <a-list
            item-layout="horizontal"
            :data-source="rooms.group_rooms"
          >
            <template
              v-if="!Loading"
              #renderItem="{ item }"
            >
              <a-list-item>
                <a-list-item-meta>
                  <template #description>
                    <a-typography-paragraph
                      style="font-size: 8px;color: #707070;"

                      :ellipsis="true"
                    >
                      {{ getNotify(item.id) }}
                    </a-typography-paragraph>
                  </template>
                  <template #title>
                    <router-link :to="'/room/'+item.id">
                      {{ item.name }}
                    </router-link>
                  </template>
                  <template #avatar>
                    <a-badge
                      :dot="item.id!==roomID && getNotify(item.id)"
                    >
                      <account-avatar
                        :avatar="{src:item.avatar,
                                  username:item.name,
                                  shape:'square',
                                  size:40,length:4
                        }"
                      />
                    </a-badge>
                  </template>
                </a-list-item-meta>
                <span class="text-gray-400 text-sm">
                  {{ new Date().getHours() + ':' + new Date().getMinutes() }}
                </span>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>
      </a-collapse>
    </a-layout-content>
  </a-card>
</template>
<script setup lang="ts">
import {
  computed, inject, ref,

} from 'vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import useAccountStore from '@/store/account';
import AccountAvatar from '@/components/account/accountAvatar.vue';
import useChannelStore from '@/store/channel';

const useAccount = useAccountStore();
useAccount.asyncGetUserJoinRooms();
const Loading = inject('Loading');
const activeKey = ref('group');
const route = useRoute();
const roomID = computed(
  () => (Number.isNaN(Number(route.params.roomID)) ? 1 : Number(route.params.roomID)),
);
const rooms = computed(() => useAccount.rooms);
const cache = useChannelStore();
const getNotify = (roomID:number) => cache.getNewMsgByRoomID(roomID);

</script>
<style scoped>

::v-deep .ant-card-body {
    padding: 10px !important;
}

@media (max-width: 992px) {
    .h-800px {
        height: auto;
        max-height: 250px;
    }
}

::v-deep .ant-collapse-content-box {
    padding: 8px;
}
</style>
