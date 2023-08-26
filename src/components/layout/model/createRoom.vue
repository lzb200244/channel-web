<template>
  <a-modal
    v-model:visible="props.value"
    @cancel="closeModal"
  >
    <a-tabs
      v-model:activeKey="activeKey"
      centered
    >
      <a-tab-pane
        key="create"
        tab="创建群聊"
      >
        <a-form
          :model="roomState"
          name="basic"
          autocomplete="off"
          layout="vertical"
          @finish="createRoom"
        >
          <a-form-item
            label="群名称"
            name="name"
            :rules="[{ required: true, message: '请输入群聊名称' }]"
          >
            <a-input v-model:value="roomState.name" />
          </a-form-item>
          <a-form-item
            label="群描述"
            name="desc"
          >
            <a-textarea v-model:value="roomState.desc" />
          </a-form-item>
          <a-form-item
            name="isPublic"
            label="公开群聊"
          >
            <a-checkbox v-model:checked="roomState.isPublic" />
          </a-form-item>
          <a-form-item
            v-if="!roomState.isPublic"
            label="Password"
            name="password"
            :rules="[{ required: true, message: '需要填房间密码哦！' }]"
          >
            <a-input-password v-model:value="roomState.password" />
          </a-form-item>
          <a-form-item class="float-right">
            <a-button
              type="primary"
              html-type="submit"
            >
              创建
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane
        key="join"
        tab="加入群聊"
        force-render
      >
        <a-input-search
          v-model:value="search"
          placeholder="搜索群聊：ID、名称进行搜索"
          enter-button
        />
        <template v-if="rooms.length===0">
          <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
        </template>
        <template v-else>
          <a-list
            item-layout="horizontal"
            :data-source="rooms"
          >
            <template

              #renderItem="{ item }"
            >
              <a-list-item>
                <a-list-item-meta
                  :description="item.desc"
                >
                  <template #title>
                    {{ item.name }}
                  </template>
                  <template #avatar>
                    <account-avatar
                      :avatar="{src:item.avatar,username:item.name,shape:'square',size:40,length:4}"
                    />
                  </template>
                </a-list-item-meta>
                <template
                  v-if="item.isPublic"
                  #actions
                >
                  <a-tag>
                    公开
                  </a-tag>
                  <a
                    key="list-loadmore-more"
                    @click="joinRoom(item.id,item.password)"
                  >加入</a>
                </template>
                <template
                  v-else
                  #actions
                >
                  <a-tag>
                    密码
                  </a-tag>
                  <a-input
                    v-model:value="item.password"
                    class="w-80px "
                    size="small"
                    placeholder="输入房间密码。。"
                  />
                  <a
                    key="list-loadmore-more"
                    @click="joinRoom(item.id,item.password)"
                  >加入</a>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </template>
      </a-tab-pane>
    </a-tabs>

    <template #footer />
  </a-modal>
</template>
<script lang="ts" setup>
import {
  reactive, ref, computed,
} from 'vue';
import { Empty, message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { createChatRoomAsync, joinRoomAsync } from '@/apis/channel';
import useAccountStore from '@/store/account';
import AccountAvatar from '@/components/account/accountAvatar.vue';
import useChannelStore from '@/store/channel';

const router = useRouter();
const useAccount = useAccountStore();
const useChannel = useChannelStore();
const search = ref('');
const props = defineProps({
  value: {
    type: Boolean,
    default: () => false,
  },
});

useChannel.asyncGetRooms(1);
const emits = defineEmits(['update:value']);
const rooms = computed(
  () => useChannel.rooms.filter(
    (item) => item.name.includes(search.value) || item.id.toString() === search.value,
  ),
);

const closeModal = () => {
  emits('update:value', false);
};
const activeKey = ref('create');

interface RoomState {
    name: string,
    desc: string,
    isPublic: boolean,
    password: string | null,
}

const joinRoom = async (roomID: number, password: string) => {
  const res = await joinRoomAsync(roomID, password);
  // 加入到我的群聊
  useAccount.rooms.group_rooms.push(res.data);
  message.success('加入成功');
  emits('update:value', false);
  await router.push(`/room/${roomID}`);
};
const roomState = reactive<RoomState>({
  name: '',
  desc: '',
  isPublic: true,
  password: null,
});
/**
 * 创建群聊
 * @param values
 */
const createRoom = async (values: RoomState) => {
  const res = await createChatRoomAsync(values);
  if (res.code === 1000) {
    message.success('创建成功');
    // 放入我的群聊
    useAccount.joinRoom(res.data);
    await router.push(`/room/${res.data.id}`);
    emits('update:value', false);
  }
};
</script>
