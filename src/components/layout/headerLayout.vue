<template>
  <a-card
    style="background-color: transparent;"
    size="small"
  >
    <a-row>
      <a-avatar
        v-if="Object.keys(userObj).length===0"
        :size="45"
        @click="visible = true"
      >
        匿名
      </a-avatar>

      <a-avatar
        v-else
        :size="45"
        :src="userObj.avatar"
      />
    </a-row>
    <div>
      <a-modal
        v-model:visible="visible"
        @cancel="visible = false"
        @close="visible = false"
      >
        <account />
        <template #footer />
      </a-modal>
    </div>
  </a-card>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';

import useAccountStore from '@/store/account';
import Account from '@/views/account.vue';
// const Account = defineAsyncComponent(() => import('@/views/account.vue'));
const user = useAccountStore();
user.asyncUser();
const userObj = computed(() => user.user);
/**
 * 登录
 */

const visible = ref<boolean>(false);

// const isLogin = computed(() => visible.value);

</script>
