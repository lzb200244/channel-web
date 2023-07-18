import {
  RouteRecordRaw, createRouter, createWebHistory,
} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    component: () => import('@/test.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/chat.vue'),
  },
  {
    path: '/chat',
    redirect: '/',

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
