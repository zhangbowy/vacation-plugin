/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 */
export default {
  dev: {
    "/vacation": {
      target: "http://vacation-pc.forwe.work/vacation",
      changeOrigin: true,
      pathRewrite: {
        '^/vacation': '',
      },
      cookiePathRewrite: '/'
    },
    "/mock/": {
      target: "http://0.0.0.0:3000",
      changeOrigin: true,
      pathRewrite: {
        "^": "",
      },
    },
  },
  test: {
    "/api/": {
      target: "https://preview.pro.ant.design",
      changeOrigin: true,
      pathRewrite: {
        "^": "",
      },
    },
  },
  pre: {
    "/api/": {
      target: "your pre url",
      changeOrigin: true,
      pathRewrite: {
        "^": "",
      },
    },
  },
}
