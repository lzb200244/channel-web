<script setup lang="ts">

import {
  computed, onUnmounted, ref, watch,
} from 'vue';

import AccountAvatar from '@/components/account/accountAvatar.vue';
import useChannelStore from '@/store/channel';

const props = defineProps({
  //   是否是回复
  members: {
    type: Array,
    default: () => [],
  },

});
let timer:any;
const channelStore = useChannelStore();
const showState = ref(false);
const stateVal = ref('');
const userMap = computed(() => channelStore.userMap);
watch(
  () => props.members?.length, // 监听的源
  (newMembers, oldMembers) => {
    // 当 members 数组发生变化时触发的回调函数
    // 点赞操作
    if (newMembers > oldMembers) {
      stateVal.value = '+1';
    } else {
    //     取消点赞操作
      stateVal.value = '-1';
    }
    showState.value = true;
    timer = setTimeout(() => {
      showState.value = false;
    }, 200);

    // 在这里你可以执行任何你想要的操作，比如更新数据、触发动画等
  },
);
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<template>
  <a-popover title="谁点赞了">
    <template #content>
      <div class="thumb-box">
        <account-avatar
          v-for="userID in members"
          :key="userID"
          style="float: left;margin-right: 10px;"
          :avatar="{
            src:userMap.get(userID)?.avatar,
            username:userMap.get(userID)?.username,
            length: 1, size: 25
          }"
        />
      </div>
    </template>
    <div class="avatar-stack">
      <template
        v-for="userID in members.slice(0,3)"
        :key="userID"
      >
        <account-avatar
          class="avatar"
          :avatar="{
            src:userMap.get(userID)?.avatar,
            username:userMap.get(userID)?.username,
            length: 1, size: 20
          }"
        />
      </template>
      <div style="position: absolute;left: 60px">
        <span>+{{ members.length }}</span>
      </div>
    </div>
    <transition name="like-animation">
      <div
        v-if="showState"
        class="like-animation"
      >
        {{ stateVal }}
      </div>
    </transition>
  </a-popover>
</template>

<style scoped>
.avatar-stack{
    position: relative;
}
.avatar {
    position: absolute;
    object-fit: cover;
    z-index: 1000;
}

.avatar:nth-child(2) {
    left: 15px;
}

.avatar:nth-child(3) {
    left: 30px;
}
.thumb-box{
    min-width: 150px;max-width: 180px;min-height: 70px
}
.like-animation {
    position: absolute;
    top: -20px;
    left: 60px;
    font-size: 14px;
    color: green;
    animation: likeUp 1s ease-out;
}

@keyframes likeUp {
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    50% {
        transform: translateY(-20px);
        opacity: 1;
    }
    100% {
        transform: translateY(-40px);
        opacity: 0;
    }
}
</style>
