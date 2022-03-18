import { SESSION_KEY_CORPID } from '@/constant';

console.log('need decide accessCode')
const config = {
  accessCode: '', // 这个需要根据钉钉的页面参数来决定，由它决定调用的登录接口及 headerReturn 的值
  headerReturn: false,
  corpId: '',
  token: '',
  authMap: {},
  loginInfo: {}
};

const cacheKeyMap = {
  corpId: SESSION_KEY_CORPID,
};

const cacheSessionKeys = ['corpId'];
const cacheLocalKeys = [];

// 将 config 数据，持久缓存
const proxyConfig = new Proxy(config, {
  get(target, key) {
    if (cacheSessionKeys.includes(key)) {
      return sessionStorage.getItem(cacheKeyMap[key]);
    }

    if (cacheLocalKeys.includes(key)) {
      return localStorage.getItem(cacheKeyMap[key]);
    }

    return target[key];
  },

  set(target, key, value) {
    if (cacheSessionKeys.includes(key)) {
      sessionStorage.setItem(cacheKeyMap[key], value);
    }

    if (cacheLocalKeys.includes(key)) {
      localStorage.setItem(cacheKeyMap[key], value);
    }

    target[key] = value;

    return true;
  },

  deleteProperty(target, key) {
    if (cacheSessionKeys.includes(key)) {
      sessionStorage.removeItem(cacheKeyMap[key]);
    }

    if (cacheLocalKeys.includes(key)) {
      localStorage.removeItem(cacheKeyMap[key]);
    }

    delete target[key];

    return true;
  },
});

export const setConfig = (data) => {
  if (typeof data === 'object') {
    Object.assign(proxyConfig, data);
  }
};

export default proxyConfig;
