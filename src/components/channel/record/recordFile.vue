<template>
  <a-card
    v-once
  >
    <a-row
      class="items-center"
      align="center"
    >
      <a-col>
        <a-avatar
          shape="square"
          :size="40"
          :src="getFileIcon(fileInfo.fileName)"
        />
      </a-col>
      <a-col>
        <a-typography-title :level="5">
          {{ getFileNameWithoutPrefix }}
        </a-typography-title>
        <div>
          {{ calFileSize(fileInfo.fileSize) }}
        </div>
      </a-col>
      <a-col
        class=" ml-auto"
      >
        <a :href="fileInfo.filePath">
          <download-outlined />
        </a>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup lang="ts">
import { DownloadOutlined } from '@ant-design/icons-vue';
import { computed } from 'vue';
import { FileInfo } from '@/types/channel';
import { getFileExtension } from '@/hooks/tencent/cos';

const props = defineProps({
  fileInfo: {
    type: Object as () => FileInfo,
    default: {} as FileInfo,
  },
});
const calFileSize = (size:number) => (`${size.toFixed(2)}KB`);
const getFileIcon = (fileName: string) => {
  const fileExtension = getFileExtension(fileName);
  const iconPath = '/files_type/';
  const supportedExtensions = ['doc', 'file', 'pdf', 'png', 'txt', 'xls'];
  const icon = supportedExtensions.includes(fileExtension) ? fileExtension : 'file';
  return `${iconPath}${icon}.png`;
};
/**
 * 获取文件名
 */
const getFileNameWithoutPrefix = computed(() => props.fileInfo.fileName.split(':')[1]);
</script>
