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
          <a-form-item style="float: right">
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

        <a-list
          v-if="rooms.length!==0"
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
                  <a-avatar
                    v-if="item.avatar"
                    :size="40"
                    shape="square"
                    :src="item.avatar"
                  />
                  <a-avatar
                    v-else
                    :size="40"
                    shape="square"
                  >
                    <!--                       :style="{backgroundColor: bgColor}"-->
                    {{ item.name.slice(0, 4) }}
                  </a-avatar>
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
                  style="width: 80px;font-size: 10px"
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
      </a-tab-pane>
    </a-tabs>

    <template #footer />
  </a-modal>
</template>
<script lang="ts" setup>
import {
  computed, defineEmits, reactive, ref,
} from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { createChatRoomAsync, getRoomAsync, joinRoomAsync } from '@/apis/channel';
import useAccountStore from '@/store/account';
import { Group } from '@/types/channel';

const router = useRouter();
const useAccount = useAccountStore();
const search = ref('');
const props = defineProps({
  value: {
    type: Boolean,
    default: () => false,
  },
});
const emits = defineEmits(['update:value']);
const rooms = computed<Group[]>(() => []);
getRoomAsync(1).then((res) => {
  rooms.value.push(...res.data.results);
});
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
  useAccount.rooms.push(res.data);
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
