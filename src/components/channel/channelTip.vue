<template>
  <a-card class="tip-list-height tip-box">
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
                <span style="color: #707070;font-size: 10px">
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
                <span style="color: #707070;font-size: 10px">
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
import { Empty } from 'ant-design-vue';
import useAccountStore from '@/store/account';
import AccountAvatar from '@/components/account/accountAvatar.vue';

const useAccount = useAccountStore();
useAccount.asyncGetUserJoinRooms();
const Loading = inject('Loading');

const activeKey = ref('group');

const rooms = computed(() => useAccount.rooms);

</script>
<style scoped>
.tip-box {
    overflow-y: auto;
}

::v-deep  .ant-card-body {
    padding:10px !important;
}

.tip-list-height {
    height: 800px;
}

@media (max-width: 992px) {
    .tip-list-height {
        height: auto;
        max-height: 250px;
    }
}

::v-deep .ant-collapse-content-box {
    padding: 8px;
}
</style>
