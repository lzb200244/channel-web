import './style.css';
import 'animate.css';
import 'virtual:windi.css';
import 'ant-design-vue/dist/antd.css';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';
import VueMarkdownEditor from '@kangc/v-md-editor';
import VueVirtualScroller from 'vue3-virtual-scroller';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as xss from 'xss';
import App from './App.vue';
import router from './router';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VueMarkdownEditor.use(createCopyCodePlugin());

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(VueVirtualScroller);// 虚拟滚动列表
app.use(VueMarkdownEditor);// markdown

// 指令
app.directive('xss', {
  updated(el: { innerHTML: string; }, binding: { value: string; }) {
    const filterXSS = new xss.FilterXSS({
      whiteList: {
        span: ['class'],
      },
    });
    el.innerHTML = filterXSS.process(binding.value);
  },
});
app.mount('#app');
