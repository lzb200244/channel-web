<template>
  <div class="relative">
    <!--    <a-progress-->
    <!--      v-if="percent!==0"-->
    <!--      status="active"-->
    <!--      :percent="percent"-->
    <!--    />-->
    <div
      :class="{'blur-1':!isLogin,'flex':true,'mt-12':true}"
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
      <div
        v-show="!isLogin"
        class="overlay-text"
      >
        请登录再发言😀
      </div>
      <el-row
        :class="{'disabled-element':!isLogin,'flex':true,}"
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
          <a-button
            class="px-2"
            type="text"
          >
            😀
          </a-button>
        </a-popover>
        <a-upload
          :before-upload="handleBeforeUpload"
          :custom-request="handleCustomRequest"
          :show-upload-list="false"
          name="file"
        >
          <a-button
            type="text"
            class="px-2"
          >
            <file-image-outlined />
          </a-button>
        </a-upload>
        <a-button
          type="text"
        >
          <folder-add-outlined />
        </a-button>
        <a-button
          type="text"
          :class="{'rotate-icon': msg.length > 0, 'px-2': true}"
          @click="sendMessage"
        >
          <send-outlined />
        </a-button>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">

import {
  FileImageOutlined, SendOutlined, FolderAddOutlined,
} from '@ant-design/icons-vue';
import {
  ref, defineExpose, computed,
} from 'vue';
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';

import { message } from 'ant-design-vue';
import useCos from '@/hooks/tencent/cos';
import useChannelStore from '@/store/channel';
import { createValidateFileExtension, ImageTypes, isOverSize } from '@/utils/file/valide';

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

const emits = defineEmits(['update:value', 'send-message', 'send-file-message']);
const toFocus = ref();
const show = ref(false);
const msg = ref('');

const channelStore = useChannelStore();

const mentionList = computed(() => channelStore.onlineList);
/**
 * 上床图片
 * @param file
 */
const handleBeforeUpload = (file:File) => {
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
const { updateFile, percent } = useCos();
// 自定义上传请求
const handleCustomRequest = async (options:any) => {
  const { file } = options;

  const key = `${Date.now().toString()}:`;
  const res = await updateFile('chat-1311013567', 'chat', key, file);

  // 延迟100毫秒再进行通知，避免加载图片失败
  setTimeout(() => {
    emits('send-file-message', res);
  }, 100);
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
const adjustTextareaHeight = (event: Event | undefined) => {
  if (!event || !event.target) {
    return;
  }

  const target = event.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = `${target.scrollHeight}px`;
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
