import 'ant-design-vue/dist/antd.css';
import { createApp } from 'vue';
import './style.css';
import { createPinia } from 'pinia';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(router);
app.use(createPinia());

app.mount('#app');
