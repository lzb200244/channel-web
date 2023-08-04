<template>
  <a-card
    :bordered="false"
    style="width: 220px"
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
        {{ userInfo?.desc }}
      </template>
      <template #avatar>
        <a-avatar :src="userInfo?.avatar" />
      </template>
    </a-card-meta>
  </a-card>
</template>
<script lang="ts" setup>
import { UserInfo } from '@/types/account';

defineProps({
  userInfo: {
    type: Object as ()=>UserInfo,
    default: () => <UserInfo>{},
  },
});

</script>
<style >
.ant-card-body{
    padding: 22px;
}
</style>
