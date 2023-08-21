import {
  RouteRecordRaw, createRouter, createWebHistory,
} from 'vue-router';
import { getToken } from '@/utils/cookies';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    component: () => import('@/test.vue'),
  },
  {
    path: '/',
    meta: {
      title: '自由聊天',
      keepAlive: true,
      requireAuth: false,
    },
    component: () => import('@/views/chat.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录页面',
      keepAlive: false,
      requireAuth: false,
    },
  },
  {
    path: '/register',
    component:
    () => import('@/views/register.vue'),
    meta: {
      title: '注册页面',
      keepAlive: false,
      requireAuth: false,
    },
  },
  {
    path: '/room/:roomID',
    component:
    () => import('@/views/chat.vue'),
    name: 'room',
    meta: {
      title: '的房间',
      keepAlive: false,
      requireAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component:
    () => import('@/views/error/404.vue'),
    meta: {
      title: '未找到页面',
      keepAlive: true,
      requireAuth: false,
    },
  },

];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 渲染title
  if (to.meta.title) {
    if (to.name === 'room') {
      document.title = `[${to.params.roomID}] ${<string>to.meta.title}`;
    } else {
      document.title = <string>to.meta.title;
    }
  }
  const accessToken = getToken();
  // 需要登录的页面
  if (to.meta.requireAuth && !accessToken) {
    next({
      path: '/login',
      query: {
        next: from.fullPath,
      },
    });
  }

  next();
});
export default router;
