import { defineConfig, loadEnv } from 'vite';
import Components from 'unplugin-vue-components/vite';
import vue from '@vitejs/plugin-vue';
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers';
import { resolve } from 'path';
import WindiCSS from 'vite-plugin-windicss';
import { visualizer } from 'rollup-plugin-visualizer';
// @ts-ignore
import viteCompression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      // 配置 WindCSS 插件
      WindiCSS(),
      // 配置 ant design vue 按需加载支持
      Components({
        dts: true, // 启用ts支持
        resolvers: [
          AntDesignVueResolver(),
        ],
      }),
      // rollup-plugin-visualizer 打包分析工具
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: 'test.html', // 分析图生成的文件名
        open: true, // 如果存在本地服务端口，将在打包后自动展示
      }),
      // gzip压缩配置
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),

    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    base: process.env.NODE_ENV === 'production' ? '/' : './',
    // 代理配置
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
    // 打包配置
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      target: 'modules',
      outDir: 'dist', // 指定输出路径
      assetsDir: 'assets', // 指定生成静态资源的存放路径
      rollupOptions: {
        minify: 'terser', // 混淆器，terser构建后文件体积更小
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },

  };
});
