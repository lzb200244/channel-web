<template>
  <a-menu
    class="head-mode"
    :style="{display:'flex',flexDirection:isRow?'row':'column'}"
  >
    <a-menu-item
      key="info"
    >
      <a-tooltip
        v-if="Object.keys(userObj).length===0"
        title="登录"
      >
        <a-avatar
          :size="40"
          style="background-color: #87d068"
        >
          <template #icon>
            <router-link
              style="color: white"
              to="/login"
            >
              <UserOutlined />
            </router-link>
          </template>
        </a-avatar>
      </a-tooltip>
      <a-tooltip
        v-else
        placement="topLeft"
        title="个人背包"
      >
        <account-avatar
          :avatar="{src:userObj.avatar,username:userObj.username,size:40,length:1}"
          @click="updateInfo"
        />
      </a-tooltip>
    </a-menu-item>
    <a-menu-item
      key="room"
      style="margin-top: auto;"
    >
      <a-tooltip
        placement="topLeft"
        title="创建群聊 | 加入群聊"
      >
        <a-button
          type="text"
          style="margin-bottom: 16px;float: right"
          @click="createRoomModel=true"
        >
          <plus-circle-outlined
            class=" create-room"
          />
        </a-button>
      </a-tooltip>
    </a-menu-item>

    <a-menu-item
      v-if="isRow"
      key="more"
      style="margin-left: auto"
    >
      <a-button
        type="primary"
        style="margin-bottom: 16px;float: right"
        @click="showDrawer"
      >
        <MenuFoldOutlined />
      </a-button>
    </a-menu-item>
  </a-menu>
  <create-room v-model:value="createRoomModel" />

  <a-modal
    v-model:visible="showInfo"
    cancel-text="取消"
    ok-text="更新"
    @ok="handleUpdateInfo"
  >
    <a-row justify="center">
      <a-col>
        <account-avatar

          :avatar="{src:userObj.avatar,username:userObj.username,size:100,length:1}"
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
    <a-row justify="center">
      <a-card
        title="我的勋章"
        :bordered="false"
      >
        <a-tooltip
          v-for="i in useAccount.medals"
          :key="i.id"
          :title="i.acquire?`已经获得：${i.create_time}`:'还未获得'"
        >
          <a-avatar

            :key="i.title"
            :class="{'gray-image':!i.acquire}"
            :size="100"
            :src="i.path"
          />
        </a-tooltip>
      </a-card>
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

              :before-upload="handleBeforeUpload"
              :custom-request="beforeUpload"

              :show-upload-list="false"
              name="file"
            >
              <a-button>
                本地上传
                <upload-outlined />
              </a-button>
            </a-upload>
          </a-col>
        </a-row>
      </a-radio-group>
    </a-row>
  </a-modal>
  <a-drawer
    v-model:visible="visible"
    placement="right"
    width="250"
  >
    <channel-status />
  </a-drawer>
</template>
<script setup lang="ts">
import {
  computed, onMounted, reactive, ref,
} from 'vue';
import {
  UploadOutlined,
  PlusCircleOutlined,
  UserOutlined,
  MenuFoldOutlined,

} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import useAccountStore from '@/store/account';
import { UserInfo } from '@/types/account';
import useCos from '@/hooks/tencent/cos';
import ChannelStatus from '@/components/channel/channelStatus.vue';
import { createValidateFileExtension, ImageTypes, isOverSize } from '@/utils/file/valide';
import CreateRoom from '@/components/layout/model/createRoom.vue';
import AccountAvatar from '@/components/account/accountAvatar.vue';

const useAccount = useAccountStore();
// 初始化用户

useAccount.asyncUser();
useAccount.asyncGetUserJoinRooms();
const visible = ref<boolean>(false);
const createRoomModel = ref<boolean>(false);

const showDrawer = () => {
  visible.value = true;
};
const userObj = computed(() => useAccount.user);
const showInfo = ref<boolean>(false);
const showAvatarList = ref<boolean>(false);
// 原来更新用户信息的
const userinfo = reactive<UserInfo>({
  userID: 0,
  username: '',
  avatar: '',
  isModify: false,
} as UserInfo);
const isRow = ref(false);
/**
 * 监听屏幕的宽度变化
 */
const onResize = () => {
  isRow.value = window.innerWidth < 992;
};
const handleBeforeUpload = (file: File) => {
  // 可以在这里对上传的文件进行校验，例如文件类型、文件大小限制等
  let valid = createValidateFileExtension(ImageTypes);
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
onMounted(() => {
  window.addEventListener('resize', onResize); // 监听resize事件
});
const updateInfo = async () => {
  await useAccount.asyncGetMedals();

  Object.assign(userinfo, userObj.value);
  showInfo.value = true;
};
const handleUpdateInfo = async () => {
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
const { updateFile } = useCos('http://127.0.0.1:8000/api/user/get_credict', '');
/**
 * 上传头像
 * @param file file对象
 */
const beforeUpload = async (file: any) => {
  const { fileName, filePath } = await updateFile(
    'chat-avatar-1311013567', 'avatar', `${userObj.value.userID}`, file.file,
  );
  console.log(fileName, filePath);
  // 更新头像,其实不需要更新因为每次上传的cos都是一个key这保证了每次上传都不会修改掉历史数据,
  // 历史数据的头像也会随着cos的改变
  userinfo.avatar = filePath;
  // const res = await useUpload(cos, 'chat-avatar-1311013567').uploadImg(info as File);
};

</script>
<style scoped>
.gray-image {
    filter: grayscale(100%);
}

.create-room {

    font-size: 25px;
    color: rgba(71, 174, 239, 0.6);

    &:hover {
        color: rgb(71, 171, 234);
        transition: all 1s linear; /* 定义过渡属性和时间 */

    }
}

.head-mode {
    height: 800px;
    position: relative;

}

@media (max-width: 992px) {
    .head-mode {
        position: relative;
        height: 60px;
    }
}

</style>
