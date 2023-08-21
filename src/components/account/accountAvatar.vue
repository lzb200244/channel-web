<template>
  <template v-if="!avatar.src">
    <a-avatar
      :style="{backgroundColor:bgColor}"
      :shape="avatar.shape"
      :size="avatar.size"
    >
      {{ avatar.username.slice(0,avatar.length) }}
    </a-avatar>
  </template>
  <template v-else>
    <a-avatar
      :style="{backgroundColor:bgColor}"
      :src="avatar.src"
      :shape="avatar.shape"
      :size="avatar.size"
    />
  </template>
</template>

<script  lang="ts" setup>
import { computed } from 'vue';

const bgColor = computed(() => {
  const currentHour = new Date().getHours();
  const hue = (currentHour * 15) % 360; // Calculate hue value based on current hour
  return `hsl(${hue}, 50%, 60%)`;
});
interface AvatarProps {
    src?: string;
    username?: string;
    shape?: string;
    size?: number;
    length?: number;
}

defineProps({
  avatar: {
    type: Object as ()=>AvatarProps,
    default: () => <AvatarProps>{
      src: '',
      username: '',
      shape: 'circle',
      size: 50,
      length: 1,

    },
  },
});
</script>
