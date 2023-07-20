<template>
  <div>
    <a-button
      type="primary"
      @click="showModal"
    >
      Open Modal
    </a-button>
    <a-modal
      v-model:visible="visible"
      @ok="handleOk"
    >
      <a-row justify="center">
        <a-col>
          <a-avatar
            :size="100"
            style="border: 2px solid #fafafa"
            src="https://p3-passport.byteimg.com/img/user-avatar/d98f1b02dbba6306a63e1f97e6b045ad~100x100.awebp"
            @click="uploadAvatar"
          >
            toux1
          </a-avatar>
        </a-col>
      </a-row>

      <a-row justify="center">
        <a-col>
          <a-typography-paragraph
            v-model:content="editableStr"
            :editable="userinfo.isModify"
          />
        </a-col>
      </a-row>
      <a-row justify="center">
        <a-alert
          message="昵称不需重复哦！！"
          type="info"
          banner
        />
      </a-row>
      <a-row justify="space-between">
        <a-avatar
          v-for="i in 8"
          :key="i"
          :size="100"
          style="border: 2px solid #fafafa;"

          :src="`/avatar/boy-${i}.svg`"
        />
      </a-row>
    </a-modal>
    <a-modal
      v-model:visible="visible2"
      title="预选头像"
      @ok="handleOk2"
    >
      <a-row justify="space-between">
        <a-radio-group v-model:value="radio">
          <a-radio
            v-for="i in 8"
            :key="i"
            :value="`/avatar/boy-${i}.svg`"
          >
            <a-avatar
              :key="i"
              :size="65"
              style="border: 2px solid #fafafa;"
              :src="`/avatar/boy-${i}.svg`"
            />
          </a-radio>
        </a-radio-group>
      </a-row>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { userInfo } from '@/types/account';

const visible = ref<boolean>(false);
const visible2 = ref<boolean>(false);
const showModal = () => {
  visible.value = true;
};
const editableStr = ref('斑斑砖');
const radio = ref('');
const handleOk = (e: MouseEvent) => {
  console.log(e);
  console.log(4444);
  visible.value = false;
};
const handleOk2 = (e: MouseEvent) => {
  console.log(e);
  visible2.value = false;
};

const userinfo = reactive<userInfo>({
  username: '',
  avatar: '',
  isModify: true,
  userID: 0,
});
const uploadAvatar = () => {
  visible2.value = true;
};
</script>
