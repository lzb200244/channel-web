<script setup lang="ts">
import {
  onMounted, ref,

} from 'vue';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const initLoading = ref(true);
const data = ref([]);
const list = ref([]);
onMounted(() => {
  fetch(fakeDataUrl)
    .then((res) => res.json())
    .then((res) => {
      initLoading.value = false;
      data.value = res.results;
      list.value = res.results;
    });
});
</script>

<template>
  <a-card>
    <a-layout-content
      style="height:750px"
      class="tip-box"
    >
      <a-list
        :loading="initLoading"
        item-layout="horizontal"
        :data-source="list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-skeleton
              avatar
              :title="false"
              :loading="!!item.loading"
              active
            >
              <a-list-item-meta
                description="Anined by Ant UED Team"
              >
                <template #title>
                  <a href="#">{{ item.name.last }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.picture.large" />
                </template>
              </a-list-item-meta>
              <span style="color: #707070;font-size: 10px">{{ new Date().getHours()+':'+ new Date().getMinutes() }}</span>
            </a-skeleton>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-content>
  </a-card>
</template>

<style scoped>
.tip-box{

    overflow-y: auto;
}
.ant-card-body{
    padding: 10px!important;
}
</style>
