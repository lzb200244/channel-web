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
    path: '/login',
    component: () => import('@/views/login.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/register.vue'),
  },
  {
    path: '/chat',
    redirect: '/',
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
