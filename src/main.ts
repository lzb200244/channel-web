import 'ant-design-vue/dist/antd.css';
import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import 'virtual:windi.css';
import VueVirtualScroller from 'vue3-virtual-scroller';

import VueMarkdownEditor from '@kangc/v-md-editor';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import App from './App.vue';
import router from './router';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VueMarkdownEditor.use(createCopyCodePlugin());

const app = createApp(App);
app.use(router);
app.use(createPinia());
// 虚拟滚动列表
app.use(VueVirtualScroller);
// markdown
app.use(VueMarkdownEditor);
app.mount('#app');
