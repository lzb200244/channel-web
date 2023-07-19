import 'ant-design-vue/dist/antd.css';
// import 'ant-design-vue/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件

import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import VueVirtualScroller from 'vue3-virtual-scroller';
import router from './router';
import App from './App.vue';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import 'virtual:windi.css';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(VueVirtualScroller);
app.mount('#app');
