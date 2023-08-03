<template>
  <a-card>
    <a-layout-content
      class="tip-box tip-list-height"
    >
      <a-input
        v-model:value="userName"
        style="margin: 15px 0"
        placeholder="Basic usage"
      >
        <template #prefix>
          <user-outlined type="user" />
        </template>
        <template #suffix>
          <a-tooltip title="Extra information">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </template>
      </a-input>
      <a-collapse
        v-model:activeKey="activeKey"

        style="border: none;"
        expand-icon-position="right"
      >
        <a-collapse-panel
          key="1"
          style="border: none;"
          :show-arrow="true"
          :bordered="false"
        >
          <template #header>
            <span>个人</span>
          </template>
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
                    description="Anined by Ant "
                  >
                    <template #title>
                      <a href="#">{{ item.name.last }}</a>
                    </template>
                    <template #avatar>
                      <a-avatar
                        :size="40"
                        shape="square"
                        :src="item.picture.large"
                      />
                    </template>
                  </a-list-item-meta>
                  <span style="color: #707070;font-size: 10px">
                    {{ new Date().getHours()+':'+ new Date().getMinutes() }}</span>
                </a-skeleton>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>
        <a-collapse-panel
          key="2"
          style="border: none;"
          :show-arrow="true"
          header="群消息"
        >
          <p>1111111111</p>
        </a-collapse-panel>
      </a-collapse>
    </a-layout-content>
  </a-card>
</template>
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
const showMorePointer = ref(false);
const activeKey = ref(['1']);
</script>
<style scoped>
.tip-box{

    overflow-y: auto;
}
.ant-card-body{
    padding: 0px!important;
}
.tip-list-height{
    height: 750px;
}
@media (max-width: 992px) {
    .tip-list-height{
        height: auto;
        max-height: 250px;
    }
}

::v-deep .ant-collapse-content-box{
    padding: 8px;
}
</style>
