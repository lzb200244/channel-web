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

          :bordered="false"
        >
          <template #header>
            <span>个人</span>
          </template>
          <a-list
            item-layout="horizontal"
            :data-source="rooms"
          >
            <a-skeleton
              v-for="i in 5"
              :key="i"
              avatar
              :title="false"
              :loading="Loading"
              active
            />
            <template
              v-if="!Loading"
              #renderItem="{ item }"
            >
              <a-list-item v-if="item.type === 1">
                <a-list-item-meta
                  :description="item.desc"
                >
                  <template #title>
                    <router-link :to="'/room/'+item.id">
                      {{ item.name }}
                    </router-link>
                  </template>
                  <template #avatar>
                    <a-avatar
                      v-if="item.avatar"
                      :size="40"
                      shape="square"
                      :src="item.avatar"
                    />
                    <a-avatar
                      v-else
                      :size="40"
                      shape="square"
                      :style="{backgroundColor: bgColor}"
                    >
                      {{ item.name.slice(0,4) }}
                    </a-avatar>
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
            :data-source="rooms"
          >
            <template
              v-if="!Loading"
              #renderItem="{ item }"
            >
              <a-list-item v-if="item.type === 2">
                <a-list-item-meta
                  :description="item.desc"
                >
                  <template #title>
                    <router-link :to="'/room/'+item.id">
                      {{ item.name }}
                    </router-link>
                  </template>
                  <template #avatar>
                    <a-avatar
                      v-if="item.avatar"
                      :size="40"
                      shape="square"
                      :src="item.avatar"
                    />
                    <a-avatar
                      v-else
                      :size="40"
                      shape="square"
                      :style="{backgroundColor: bgColor}"
                    >
                      {{ item.name.slice(0,4) }}
                    </a-avatar>
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
import useAccountStore from '@/store/account';

const useAccount = useAccountStore();

const Loading = inject('Loading');

const activeKey = ref('person');
const bgColor = computed(() => {
  const currentHour = new Date().getHours();
  const hue = (currentHour * 15) % 360; // Calculate hue value based on current hour

  return `hsl(${hue}, 50%, 60%)`;
});

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
