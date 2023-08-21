<template>
  <div class="relative">
    <el-row
      :class="{'disabled-element':!isLogin,'flex':true,}"
    >
      <a-tooltip placement="topLeft">
        <template #title>
          <span>emoji</span>
        </template>
        <a-popover
          v-model:visible="show"
          trigger="click"
        >
          <template #content>
            <EmojiPicker
              v-once
              style="box-shadow: none;width: 250px"
              :native="true"
              :hide-search="true"
              :display-recent="true"
              :disable-skin-tones="true"
              :disabled-groups="['flags','travel_places']"
              @select="onSelectEmoji"
            />
          </template>
          <a-button
            class="px-2"
            type="text"
          >
            😀
          </a-button>
        </a-popover>
      </a-tooltip>
      <a-tooltip placement="topLeft">
        <template #title>
          <span>图片</span>
        </template>
        <a-upload
          :before-upload="handleBeforeUploadImg"
          :custom-request="handleCustomRequestImg"
          :show-upload-list="false"
          name="file"
        >
          <a-button
            type="text"
            class="px-2"
          >
            <file-image-outlined v-once />
          </a-button>
        </a-upload>
      </a-tooltip>
      <a-tooltip placement="topLeft">
        <template #title>
          <span>文件</span>
        </template>
        <a-upload
          :before-upload="handleBeforeUploadFile"
          :custom-request="handleCustomRequestFile"
          :show-upload-list="false"
          name="file"
        >
          <a-button
            type="text"
            class="px-2"
          >
            <folder-add-outlined v-once />
          </a-button>
        </a-upload>
      </a-tooltip>

      <a-button
        :type="msg.trim().length > 0 ?'primary':'text'"
        style="margin-left: auto"
        @click="sendMessage"
      >
        发 送
      </a-button>
    </el-row>
    <el-row
      :class="{'blur-1':!isLogin,'flex':true,'mt-3':true}"
    >
      <a-mentions
        ref="toFocus"
        v-model:value="msg"
        :disabled="!isLogin"
        placeholder="输入消息..."
        rows="3"
        @select="mentionSelect"
      >
        <a-mentions-option
          v-for="item in roomMembers"
          :key="item.user.userID"
          :value="item.user.username"
        >
          {{ item.user.username }}
        </a-mentions-option>
      </a-mentions>
      <div
        v-show="!isLogin"
        class="overlay-text"
      >
        请登录再发言😀
      </div>
    </el-row>
  </div>
</template>

<script setup lang="ts">

import {
  FileImageOutlined, FolderAddOutlined,
} from '@ant-design/icons-vue';
import {
  ref, defineExpose, computed, defineEmits, onMounted, onBeforeMount,
} from 'vue';
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';
import { message } from 'ant-design-vue';
import { OptionProps } from 'ant-design-vue/lib/vc-select/Option';
import useCos from '@/hooks/tencent/cos';
import useChannelStore from '@/store/channel';
import { createValidateFileExtension, isOverSize, ImageTypes } from '@/utils/file/valide';
import { MessageTypeEnum } from '@/types/channel/enum';

defineProps({
  value: {
    type: String,
    default: () => '',
  },

  isLogin: {
    type: Boolean,
    default: () => false,
  },
});

const emits = defineEmits(['update:value', 'send-message', 'send-file-message', 'mention']);
const toFocus = ref();
const show = ref(false);
const msg = ref('');

const channelStore = useChannelStore();
/**
 * @description '@'操作符时
 * @param opt
 */
const mentionSelect = (opt: OptionProps) => {
  //   调用gpt
  if (opt.value === 'AI慧聊') {
    emits('mention', MessageTypeEnum.GPT);
  }
};
const roomMembers = computed(
  () => channelStore.onlineList.online.concat(channelStore.onlineList.offline));
/**
 * 上床图片
 * @param file
 */
const handleBeforeUploadImg = (file: File) => {
  // 可以在这里对上传的文件进行校验，例如文件类型、文件大小限制等
  let valid = createValidateFileExtension(ImageTypes);
  //   if (file.size)字节
  if (isOverSize(file.size, 5)) {
    message.info('图片大小不能超过5mb');
    return;
  }
  if (!valid(file.name)) {
    message.info(`名叫${file.name}并非图片类型`);
    return false;
  }
  return true; // 返回 true 表示继续上传，返回 false 则取消上传
};

// 自定义上传请求
const handleCustomRequestImg = async (options: any) => {
  const { file } = options;
  const { updateFile } = useCos('chat/file/', 'img');
  const key = `${Date.now().toString()}:`;
  const res = await updateFile('chat-1311013567', 'chat', key, file);

  // 延迟100毫秒再进行通知，避免加载图片失败
  setTimeout(() => {
    emits('send-file-message', res, MessageTypeEnum.IMAGE);
  }, 100);
};
/**
 * 加入表情
 * @param emoji
 */
const onSelectEmoji = (emoji: any) => {
  msg.value += emoji?.i;
};
const handleBeforeUploadFile = (file: File) => {
  if (isOverSize(file.size, 20)) {
    message.info('文件过于大');
    return false;
  }
};
const handleCustomRequestFile = async (options: any) => {
  const { updateFile } = useCos('chat/file/', 'file');
  const { file } = options;
  const key = `${Date.now().toString()}`;
  const res = await updateFile('chat-file-1311013567', 'chat-file', key, file);
  setTimeout(() => {
    emits('send-file-message', res, MessageTypeEnum.FILE);
  }, 100);
};
/**
 * 调节输入框
 */
const focus = () => {
  toFocus.value.focus();
};
/**
 * 发送消息
 */
const sendMessage = () => {
  if (msg.value.trim() === '') return;
  emits('send-message', msg.value);
  msg.value = '';
};

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});
onBeforeMount(() => {
//   卸载事件
  document.removeEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
});

defineExpose({
  focus,
});
</script>
<style scoped>

.rotate-icon {
    background-color: #afff1f;
    color: white;
}

.disabled-element {
    pointer-events: none;
}

.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #48b0f1;
    cursor: pointer;
    font-size: 14px;
    z-index: 999;
}

</style>
