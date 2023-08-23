<template>
  <a-card
    :bordered="false"
    class="w-60"
  >
    <template #actions>
      <div>关注</div>
      <div>私聊</div>
      <div>点赞</div>
    </template>
    <a-card-meta
      :title="userInfo?.username"
    >
      <template #description>
        <div class="desc">
          {{ userInfo?.desc }}
        </div>

        <div
          class="medal my-2"
        >
          <a-tag
            v-for="medal in userInfo?.medals"
            :key="medal.id"
            :color="colors"
          >
            {{ medal.title }}
          </a-tag>
        </div>
      </template>
      <template #avatar>
        <account-avatar :avatar="{src:userInfo.avatar,username:userInfo.username,length:1}" />
      </template>
    </a-card-meta>
  </a-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { UserInfo } from '@/types/account';
import AccountAvatar from '@/components/account/accountAvatar.vue';

defineProps({
  userInfo: {
    type: Object as () => UserInfo,
    default: () => <UserInfo>{},
  },
});
// 随机一个颜色
const colors = computed(() => ['bg-amber-300', 'bg-cyan-400', 'bg-rose-300'][Math.floor(Math.random() * 3)]);
</script>
<style scoped>
::v-deep .ant-card-body {
    padding: 0 !important;
}
</style>
