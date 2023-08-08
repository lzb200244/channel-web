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
    path: '/room/:roomID',
    component: () => import('@/views/chat.vue'),
    name: 'room',
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
