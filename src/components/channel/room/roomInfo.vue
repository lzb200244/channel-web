<template>
  <div v-once>
    <div class="flex flex-col">
      <div class="mb-2">
        <span class="font-bold">创建者：</span>
      </div>
      <div
        class="mb-2"
        style="margin-left: 20px;margin-bottom: 20px"
      >
        <a-card-meta
          :title="roomInfo.creator?.username"
        >
          <template #avatar>
            <a-avatar :src="roomInfo.creator?.avatar" />
          </template>
        </a-card-meta>
      </div>
      <div class="mb-2">
        <span class="font-bold">是否公开：</span>
        <span>{{ roomInfo.isPublic ? '是' : '否' }}</span>
      </div>

      <div class="mb-2">
        <span class="font-bold">群聊ID：</span>
        <span>{{ roomInfo.id }}</span>
      </div>

      <div class="mb-2">
        <span class="font-bold">群聊人数：</span>
        <span>{{ 11 }}</span>
      </div>
      <div class="mb-2">
        <span class="font-bold">创建时间：</span>
        <span>{{ roomInfo.createTime }}</span>
      </div>
      <div class="mb-2">
        <span class="font-bold">群描述：</span>
        <span>{{ roomInfo.desc || "无" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Group } from '@/types/channel';

defineProps({
  //   是否是回复

  roomInfo: {
    //   消息体
    type: Object as () => Group,
    required: true,
  },
});
</script>
