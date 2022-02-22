// https://umijs.org/config/
import { defineConfig } from 'umi';
import path from 'path';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  // mfsu: {},
  webpack5: {},
  exportStatic: {},
  hash: true,
  base: process.env.NODE_ENV === 'production' ? '/vacation-pc/' : '/',
  publicPath: process.env.NODE_ENV === 'production' ? '/vacation-pc/' : '/',
  alias: {
    fim: path.join(__dirname, '../', 'src/.fim'),
  },
  define: {
    PUBLIC_PATH: '/',
    API_PREFIX: '/vacation',
    ICONFONT_URL: '//at.alicdn.com/t/font_3178022_gafqixthf6.js',
  },
  antd: {},
  sass: {},
  cssLoader: {
    localsConvention: 'camelCase',
  },
  dva: {
    hmr: true
  },
  history: {
    type: 'browser',
  },
  dynamicImport: {
    loading: '@/Loading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    '@border-radius-base': '4px',
    '@btn-default-color': '#171a1d',
    '@heading-color': '#111f2c',
    '@layout-body-background': '#fff',
    '@primary-color': '#1890ff',
    '@link-color': '#1890ff',
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // 快速刷新功能 https://umijs.org/config#fastrefresh
  fastRefresh: {},
  esbuild: {},
  chainWebpack(memo, { createCSSRule }) {
    createCSSRule({
      lang: 'stylus',
      test: /\.styl$/,
      loader: require.resolve('stylus-loader'),
    });

    // 自动生成css
    memo.plugin('css-generator-plugin').use(require.resolve('css-generator-plugin'), [
      {
        dirPath: 'src/**/*',
        generate: 'src/style/auto.css',
        type: 'react',
        important: true,
        modifyRules: {
          borderRadiusWidthDir: () => {
            return {
              regExp: /^(border-radius|br)-(?<direction>(tl|tr|br|bl))-(?<num>[0-9]+)(?<unit>px)?$/,
              render({ groups }) {
                let { direction, num, unit } = groups;
                const directionMap = {
                  tl: 'top-left',
                  tr: 'top-right',
                  br: 'bottom-right',
                  bl: 'bottom-left',
                };

                return {
                  name: 'borderRadiusWidthDir',
                  order: Infinity,
                  css: [`border-${directionMap[direction]}-radius: ${num}${unit}`],
                };
              },
            };
          },
        },
      },
    ]);

    return memo;
  },
  terserOptions: {
    output: {
      comments: false,
    },
  },
  nodeModulesTransform: {
    type: 'none',
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: '@xfw/utils',
        libraryDirectory: 'src',
        camel2DashComponentName: false,
        transformToDefaultImport: false,
        customName: (name) => {
          if (
            ['calculate', 'plus', 'minus', 'times', 'divide', 'round', 'digitLength'].includes(name)
          ) {
            return `@xfw/utils/src/calculate`;
          }

          return `@xfw/utils/src/${name}`;
        },
      },
    ],
  ],
});
