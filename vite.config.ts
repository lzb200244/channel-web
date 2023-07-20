// vite-config.ts
import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import WindiCSS from 'vite-plugin-windicss';

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(), WindiCSS(),
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
        '@': resolve(__dirname, './src'),

      },
    },
    server: {

      hmr: true,
      cors: true, // 默认启用并允许任何源
      // open: true, // 在服务器启动时自动在浏览器中打开应用程序
      proxy: {
        '/api': {
          target: env.VUE_APP_BASE_API, // 接口的域名
          changeOrigin: true,
          secure: true, // 如果是https接口，需要配置这个参数
          // 反向代理
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

  };
});
