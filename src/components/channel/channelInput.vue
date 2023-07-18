<template>
  <div class="message-container">
    <div
      style="display: flex;margin-top: 40px;"
      :class="{'disabled-input':!isLogin,}"
    >
      <a-mentions
        ref="toFocus"
        v-model:value="msg"
        :disabled="!isLogin"
        placeholder="输入消息..."

        @change="adjustTextareaHeight"
      >
        <a-mentions-option
          v-for="member in mentionList"
          :key="member.user.userID"
          :value="member.user.username"
        >
          {{ member.user.username }}
        </a-mentions-option>
      </a-mentions>
      <el-row
        style="display: flex;"
        :class="{'disabled-element':!isLogin}"
      >
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
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          name="file"
        >
          <a-button type="text">
            <file-image-outlined />
          </a-button>
        </a-upload>

        <a-button type="text">
          <folder-add-outlined />
        </a-button>
        <a-button
          type="text"
          :class="msg.length>0?'rotate-icon':''"
          @click="sendMessage"
        >
          <send-outlined />
        </a-button>
      </el-row>
    </div>
    <div
      v-show="!isLogin"
      class="overlay-text"
    >
      请登录再发言😀
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  FileImageOutlined, SendOutlined, FolderAddOutlined,
} from '@ant-design/icons-vue';
import {
  ref, defineExpose, defineProps,
} from 'vue';
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';
// const EmojiPicker = defineAsyncComponent(() => import('vue3-emoji-picker'));
import useUpload from '@/utils/upload';
import useCos from '@/utils/tencent/cos';

defineProps({
  value: {
    type: String,
    default: () => '',
  },
  mentionList: {
    type: Array<string>,
    default: () => [],
  },
  isLogin: {
    type: Boolean,
    default: () => false,
  },
});
const emits = defineEmits(['update:value', 'send-message', 'send-file-message']);
const { cos } = useCos();
const { uploadImg } = useUpload(cos);
const toFocus = ref();
const show = ref(false);
const msg = ref('');
const fileList = ref([]);
/**
 * 上床图片
 * @param info
 */
const beforeUpload = async (info: File) => {
  const res = await uploadImg(info as File, cos);

  emits('send-file-message', res);
  return false;
};
/**
 * 加入表情
 * @param emoji
 */
const onSelectEmoji = (emoji: any) => {
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
const sendImgMessage = () => {
  console.log(222);
};
defineExpose({

  focus,
});
</script>
<style scoped>
@keyframes rotateAnimation {

    100% {
        transform: rotate(-90deg);
    }
}

.rotate-icon {
    color: cornflowerblue;
    animation: rotateAnimation .4s forwards;
}

.disabled-input {

    filter: blur(1px)
}
.disabled-element {
    pointer-events: none;
}
.overlay-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #7d7dff;
    cursor: pointer;
    font-size: 14px;
    z-index: 999;
}
.message-container {
    position: relative;

}
</style>
