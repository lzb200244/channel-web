// vite-config.ts
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers';

export default defineConfig({

  plugins: [
    vue(),
    Components({
      dts: true, // 启用ts支持
      resolvers: [
        // https://github.com/antfu/unplugin-vue-components
        AntDesignVueResolver(), // 配置 ant design vue 按需加载支持
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // 设置@为/src的别名
      components: '/src/components', // 设置components为/src/components的别名
      views: '/src/views', // 设置components为/src/components的别名
    },
  },
  server: {
    hmr: true,
    cors: true, // 默认启用并允许任何源
    // open: true, // 在服务器启动时自动在浏览器中打开应用程序
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api/', // 接口的域名
        changeOrigin: true,
        secure: true, // 如果是https接口，需要配置这个参数
        // 反向代理
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

});
