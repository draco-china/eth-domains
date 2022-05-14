import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  outputPath: './docs',
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: false,
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
});
