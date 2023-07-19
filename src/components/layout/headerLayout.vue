<template>
  <a-card

    size="small"
  >
    <a-row>
      <a-avatar
        v-if="Object.keys(userObj).length===0"
        :size="45"
      >
        <router-link
          style="color: white"
          to="/login"
        >
          匿名
        </router-link>
      </a-avatar>

      <a-avatar
        v-else
        :size="45"
        :src="userObj.avatar"
        @click="updateInfo"
      />
    </a-row>
  </a-card>
  <a-modal
    v-model:visible="showInfo"
    cancel-text="取消"
    ok-text="更新"
    @ok="handleUpdateInfo"
  >
    <a-row justify="center">
      <a-col>
        <a-avatar
          :size="100"
          style="border: 2px solid #fafafa"
          :src="userinfo.avatar"
          @click="showAvatarList=true"
        />
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-col>
        <a-typography-paragraph
          v-model:content="userinfo.username"
          :editable="userinfo.isModify"
        />
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-alert
        message="昵称一个月只能修改一次哦！！"
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
    v-model:visible="showAvatarList"
    title="预选头像"
    cancel-text=" "
    ok-text="更换"
    @ok="updateAvatar"
    @cancel="updateAvatarCancel"
  >
    <a-row justify="space-between">
      <a-radio-group v-model:value="userinfo.avatar">
        <a-radio
          v-for="i in 8"
          :key="i"
          :value="`/avatar/boy-${i}.svg`"
        >
          <a-image
            :width="65"
            :src="`/avatar/boy-${i}.svg`"
            :preview="{
              src:`/avatar/boy-${i}.svg`
            }"
          />
        </a-radio>
        <a-row
          justify="space-around"
          class="m-4"
        >
          <a-col>
            <a-image
              :width="65"
              :src="userObj.avatar"
              :preview="{
                src:userObj.avatar
              }"
            />
          </a-col>

          <a-col>
            <a-upload
              v-model:file-list="fileList"
              :before-upload="beforeUpload"
              name="file"
            >
              <a-button>
                本地上传<upload-outlined />
              </a-button>
            </a-upload>
          </a-col>
        </a-row>
      </a-radio-group>
    </a-row>
  </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import useAccountStore from '@/store/account';
import { userInfo } from '@/types/account';
import useCos from '@/utils/tencent/cos';

const useAccount = useAccountStore();
useAccount.asyncUser();
const userObj = computed(() => useAccount.user);
const showInfo = ref<boolean>(false);
const showAvatarList = ref<boolean>(false);
const fileList = ref([]);
const userinfo = reactive<userInfo>({
  userID: 0,
  username: '',
  avatar: '',
  isModify: false,
});
const updateInfo = () => {
  Object.assign(userinfo, userObj.value);
  showInfo.value = true;
};
const handleUpdateInfo = async () => {
  console.log(userinfo);
  if (userinfo.username === '' || userinfo.avatar === '') {
    showInfo.value = false;
    return;
  }
  try {
    await useAccount.updateUser(userinfo);
    //   修改成功
    showInfo.value = false;
  } catch (e) {
    console.log(e);
  }
};
const updateAvatar = () => {
  showAvatarList.value = false;
};
// 取消上传
const updateAvatarCancel = () => {
  userinfo.avatar = userObj.value.avatar;
};
const { updateFile } = useCos('http://127.0.0.1:8000/api/user/get_credict');
const beforeUpload = async (file: File) => {
  const { fileName, filePath } = await updateFile(
    'chat-avatar-1311013567', `${userObj.value.userID}`, file,
  );
  console.log(fileName, filePath);
  // 更新头像,其实不需要更新因为每次上传的cos都是一个key这保证了每次上传都不会修改掉历史数据,
  // 历史数据的头像也会随着cos的改变
  userinfo.avatar = filePath;
  // const res = await useUpload(cos, 'chat-avatar-1311013567').uploadImg(info as File);
};

</script>
