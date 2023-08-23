<script setup lang="ts">

const props = defineProps({
  //   是否是回复

  content: {
    //   消息体
    type: String,
    default: '',

  },
  style: {
    type: Object,
    default: {} as Object,
  },
});
</script>

<template>
  <v-md-editor
    v-once
    v-model="props.content"
    mode="preview"
  />
</template>
