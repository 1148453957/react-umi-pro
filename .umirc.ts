import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  routes: [
    {
      path: '/',
      redirect: '/ShelfPage',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '阅读页',
      path: '/ReadPage',
      component: './ReadPage',
    },
    {
      name: '书架页',
      path: '/ShelfPage',
      component: './ShelfPage',
    },
    {
      name: '视频页',
      path: '/VideoPage',
      component: './VideoPage',
    },
  ],
  npmClient: 'pnpm',
  title: '萤火小说',
  favicons: ['/logo.webp'],
  targets: { chrome: 68 },
  alias: {
    '@': './src',
  },
});
