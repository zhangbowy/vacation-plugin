import { message } from 'antd';
import to from 'await-to-js';
import { request } from 'umi';
import config from '@/config';

// header 添加 token 和 corpId
const requestInterceptorToken = (url, options) => {
  const { token, corpId } = config;
  if (token && corpId) {
    const headers = { ...options.headers };

    headers.token = token;
    headers.corpId = corpId;

    return {
      url,
      options: {
        ...options,
        headers,
      },
    };
  }

  return {
    url,
    options,
  };
};

// 下载
const responseInterceptorDownload = async (response, options) => {
  const disposition = response.headers.get('Content-Disposition');

  if (disposition && options.download) {
    const fileBlob = await response.blob();
    const fileName = decodeURIComponent(disposition.split(';')[1].split('filename=')[1]);

    const link = document.createElement('a');
    link.href = URL.createObjectURL(fileBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);

    return fileBlob;
  }

  return response;
};

const requestInterceptorUpload = async (url, options) => {
  const { upload } = options;
  if (upload) {
    const { data } = options;
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return {
      url,
      options: {
        ...options,
        data: formData,
        requestType: 'form',
      },
    };
  }
  return { url, options };
};

const requestInterceptors = [requestInterceptorToken, requestInterceptorUpload];

const responseInterceptors = [responseInterceptorDownload];

async function middlewareTokenInvalid(ctx, next) {
  if (Number(ctx.res.errorCode) === 102) {
    message.error('登录超时，重新登录~');
    window.location.reload();
  } else {
    await next();
  }
}

async function middlewareBatchUploadInvalid(ctx, next) {
  await next();
  if (Number(ctx?.res?.errorCode) === 501001) {
    ctx.res.success = true;
    ctx.res.result = {
      errorCode: 501001,
      errorMsg: ctx.res.errorMsg || '',
    };
  }
}

export const adapRequest = async (method, url, params, options = {}) => {
  let finallyUrl = url;
  if (process.env.NODE_ENV === 'development') {
    if (options.mock) {
      finallyUrl = `/mock${url}`;
    }
  }

  try {
    const [err, result] = await to(
      request(finallyUrl, {
        method,
        requestInterceptors,
        responseInterceptors,
        [adapRequestDataKey[method.toLowerCase()] || 'data']: params,
        ...options,
      }),
    );
    if (err || !result || !result.success) {
      return [false, result];
    }
    return [true, result.result];
  } catch (e) {
    return [false, e];
  }
};

export const requestConfig = {
  prefix: API_PREFIX,
  requestInterceptors,
  responseInterceptors,
  middlewares: [middlewareTokenInvalid, middlewareBatchUploadInvalid],
  errorConfig: {
    adaptor: (resData) => {
      return {
        ...resData,
        errorMessage: resData.errorMsg || resData.error || '网络错误',
      };
    },
  },
};

export default adapRequest;

export const get = (...args) => adapRequest('get', ...args);

export const post = (...args) => adapRequest('post', ...args);
