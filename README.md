# asset-pc

## 项目结构

```text
.
├── README.md
├── config // umi 配置
│   ├── config.dev.js
│   ├── config.js
│   ├── config.production.js
│   ├── config.test.js
│   ├── externals.js // 外部引入 cdn js
│   ├── proxy.js // 本地请求代理
│   └── routes.js // 路由
├── fim.config.js // fim 配置
├── jest.config.js // 单元测试
├── jsconfig.json // 单元测试
├── mock // 假数据
│   └── route.js
├── package.json
├── snippets // vscode `IntelliSense for CSS class names in HTML` 插件
│   └── auto-use-snippets.css
├── src
│   ├── Loading.jsx
│   ├── app.js // 应用入口
│   ├── assets // 静态资源
│   │   ├── collapsed-logo.png
│   │   ├── images
│   │   │   ├── default-avator.png
│   │   │   ├── empty.png
│   │   │   └── file
│   │   │       ├── excel.png
│   │   │       ├── img.png
│   │   │       ├── pdf.png
│   │   │       ├── ppt.png
│   │   │       ├── text.png
│   │   │       ├── unknown.png
│   │   │       ├── vedio.png
│   │   │       ├── word.png
│   │   │       └── zip.png
│   │   └── logo.png
│   ├── components
│   │   ├── Avatar // 头像组件
│   │   │   ├── index.jsx
│   │   │   └── index.less
│   │   ├── CapsuleRadio // 胶囊 tab
│   │   │   ├── index.jsx
│   │   │   └── index.less
│   │   ├── GlobalHeader // 全局 header
│   │   │   ├── HeaderContentRender.jsx
│   │   │   └── index.less
│   │   ├── Icon // Icon
│   │   │   └── index.jsx
│   │   ├── Image // 图片
│   │   │   ├── index.jsx
│   │   │   └── index.less
│   │   ├── Modal // 弹窗，固定高度。如果内容超出，底部会有阴影
│   │   │   └── index.jsx
│   │   ├── ModalForm
│   │   │   └── index.jsx
│   │   ├── ProductIntroduce // 其它产品
│   │   │   ├── index.jsx
│   │   │   └── index.less
│   │   ├── Section // 页面片段
│   │   │   └── index.jsx
│   │   ├── TabBarWithNumber // tab 拓展了展示 数字
│   │   │   ├── index.jsx
│   │   │   └── index.less
│   │   └── VerticalLineWithTitle // title 左侧有一条线
│   │       ├── index.jsx
│   │       └── index.less
│   ├── config // 应用配置
│   │   └── index.js
│   ├── constant // 常量
│   │   ├── index.js
│   │   └── storage.js
│   ├── e2e // 测试
│   │   └── __mocks__
│   │       └── antd-pro-merge-less.js
│   ├── hooks
│   │   ├── index.js
│   │   ├── useArrayState.js // 操作数组
│   │   ├── useCustomizeSetFnState.js // 自定义 useState 的 setState
│   │   ├── useDispatch.js // 封装 dispatch 。缓存 dispatch 的结果
│   │   ├── useExternalPromise.js // 外部可以控制 Promise 状态
│   │   ├── useGlobalHeaderTab.js // 全局 header 的 tab
│   │   ├── usePageContainerFullView.js // 页面内容高度沾满视口
│   │   ├── useRequestLoading.js // request 增加 loading
│   │   ├── useRole.js // 权限
│   │   ├── useRowSelection.js // table 的 Selection props
│   │   ├── useTableCrud.js // table 的 增删改查
│   │   ├── useTableRequest.js // pro table 的 request
│   │   ├── useUniq.js  // 不会重复的数组
│   │   └── useUniqByKey.js  // 不会重复的数组，可以自定义不重复的属性值
│   ├── init
│   │   ├── initDingTalkJsapi.js // 初始化 dingTalkJsapi
│   │   ├── initPatchRoutes.js // 动态路由
│   │   ├── initQuery.js // 初始化 url 的 query
│   │   ├── initialState.js // 初始化全局 state
│   │   └── rootContainer.js // 自定义根节点信息
│   ├── layouts
│   │   ├── BasicLayout.jsx // 页面布局框架
│   │   ├── BlankLayout.jsx
│   │   ├── SecurityLayout.jsx
│   │   ├── index.less
│   │   └── layoutInfo.jsx // 页面布局基本信息
│   ├── models
│   │   └── global.js // 全局 data
│   ├── pages
│   │   ├── 404.jsx
│   │   ├── _layout.jsx
│   │   ├── demo
│   │   │   ├── form-demo
│   │   │   │   └── index.jsx
│   │   │   ├── index.jsx
│   │   │   └── table-demo
│   │   │       └── index.jsx
│   │   └── document.ejs
│   ├── services // 请求
│   │   ├── base.js
│   │   └── index.js
│   ├── style // 全局样式后
│   │   ├── antd-cover.less
│   │   ├── auto.css
│   │   ├── common.less
│   │   ├── index.less
│   │   └── reset.less
│   └── utils
│       ├── request.js // 请求
│       ├── routes.js // 路由跳转
│       ├── utils.js // 工具
│       └── utils.test.js
└── tests
    ├── PuppeteerEnvironment.js
    ├── beforeTest.js
    ├── getBrowser.js
    └── run-tests.js
```

## 技术栈

- [react](https://reactjs.org/)
- [ant design pro](https://pro.ant.design/index-cn/)
- [ahooks](https://ahooks.js.org/zh-CN/)
- [umi-request](https://umijs.org/zh-CN/plugins/plugin-request)
- [immer](https://immerjs.github.io/immer/)
- [lodash](https://lodash.com/)
- [css-generator-plugin](https://www.npmjs.com/package/css-generator-plugin)
- [@humbird/fim](https://kkpncg.yuque.com/kkpncg/re4yzn/sxdde2)
- 更多见 `package.json dependencies`

## 命令

- `yarn dev` 启动项目
- `yarn publish:test` 发布测试环境
- `yarn publish:production` 发布线上环境
