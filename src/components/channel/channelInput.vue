<template>
  <div style="display: flex;margin-top: 40px;">
    <a-mentions
      ref="toFocus"
      v-model:value="msg"
      placeholder="输入消息..."
      @change="adjustTextareaHeight"
    >
      <a-mentions-option
        v-for="member in mentionList"
        :key="member.message.userID"
        :value="member.message.name"
      >
        {{ member.message.name }}
      </a-mentions-option>
    </a-mentions>
    <a-popover
      v-model:visible="show"
      trigger="click"
    >
      <template #content>
        <EmojiPicker
          style="box-shadow: none;width: 250px"
          :native="true"
          :hide-search="true"
          :display-recent="true"
          :disable-skin-tones="true"
          :disabled-groups="['flags','travel_places']"
          @select="onSelectEmoji"
        />
      </template>
      <a-button type="text">
        😀
      </a-button>
    </a-popover>
    <a-button type="text">
      <file-image-outlined />
    </a-button>
    <a-button type="text">
      <folder-add-outlined />
    </a-button>
    <a-button
      type="text"
      @click="sendMessage"
    >
      <send-outlined />
    </a-button>
  </div>
</template>

<script setup lang="ts">

import { FileImageOutlined, SendOutlined, FolderAddOutlined } from '@ant-design/icons-vue';
import {
  ref, defineExpose, defineProps,
} from 'vue';
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';
// const EmojiPicker = defineAsyncComponent(() => import('vue3-emoji-picker'));

defineProps({
  value: {
    type: String,
    default: () => '',
  },
  mentionList: {
    type: Array<string>,
    default: () => [],
  },
});
const emits = defineEmits(['update:value', 'send-message']);
const toFocus = ref();
const show = ref(false);
const msg = ref('');
/**
 * 加入表情
 * @param emoji
 */
const onSelectEmoji = (emoji:any) => {
  msg.value += emoji?.i;
};
/**
 * 调节输入框
 */
const adjustTextareaHeight = () => {
  event.target.style.height = 'auto';
  event.target.style.height = `${event.target.scrollHeight}px`;
};
const focus = () => {
  toFocus.value.focus();
};
/**
 * 发送消息
 */
const sendMessage = () => {
  emits('send-message', msg.value);
  msg.value = '';
};
defineExpose({

  focus,
});
</script>
