<script setup lang="ts">
import { FileInfo } from '@/types/channel';

defineProps({
  //   是否是回复

  fileInfo: {
    //   消息体
    type: Object as () => FileInfo,
    default: {} as FileInfo,

  },
  style: {
    type: Object,
    default: {} as Object,
  },
});
</script>

<template>
  <a-image
    :style="style"
    :src="fileInfo?.filePath"
    :alt="fileInfo?.fileName"
    fallback="/error.png"
  />
</template>

<style scoped>

</style>
