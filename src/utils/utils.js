import get from 'lodash/get';
import moment from 'moment';
import { parse } from 'querystring';
import { cloneDeep } from 'lodash';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export function proxyBackUpDefault(target) {
  return new Proxy(target, {
    get(obj, prop) {
      return prop in obj ? obj[prop] : obj.default;
    },
  });
}

export function isLimitSize(size, limit = 10) {
  return size / 1000 / 1000 <= limit;
}

/**
 * 递归收集数据
 * @param {object} data
 * @param {string} recursionKey 递归的属性
 * @param {Array} collectionkeys 需要收集的属性
 * @param {function} format 收集到数据是 format 的函数
 * @param {function} addCondition 是否收集此数据
 * @param {function} stop 是否停止递归当前数据的子集
 * @returns
 */
export function recursionCollectionData(
  data,
  recursionKey = 'children',
  {
    collectionkeys = [],
    format = (val) => val,
    addCondition = () => true,
    stop = () => false,
  } = {},
) {
  const values = [];
  function recursion(recursionData) {
    if (!recursionData) return false;
    const value = collectionkeys?.length
      ? collectionkeys.reduce((all, cur) => {
          const [key, path, defaultValue = null] = Array.isArray(cur) ? cur : [cur, cur];
          // eslint-disable-next-line no-param-reassign
          all[key] = get(recursionData, path, defaultValue);
          return all;
        }, {})
      : recursionData;

    const formatValue = format(value);
    const isAddCondition = addCondition(recursionData);
    const isStop = stop(recursionData, values);

    if (!isStop) {
      if (isAddCondition) {
        values.push(formatValue);
      }

      if (Array.isArray(recursionData?.[recursionKey])) {
        return recursionData?.[recursionKey].find(recursion);
      }

      return recursion(recursionData?.[recursionKey]);
    }

    return isStop;
  }

  if (Array.isArray(data)) {
    data.find(recursion);
  } else {
    recursion(data);
  }

  return values;
}

/**
 * 递归处理数据
 * @param {object} data
 * @param {string} recursionKey 递归的属性
 * @param {function} format 处理数据函数
 * @param {function} isRemove 是否要一处当前数据
 * @returns
 */
export function recursionFormatData(
  data,
  recursionKey = 'children',
  { format = (v) => v, isRemove = () => false } = {},
) {
  const recursionData = cloneDeep(data);

  function recursionFn(paramsData, level) {
    return paramsData
      ?.map?.((item) => {
        if (item?.[recursionKey]?.length) {
          item[recursionKey] = recursionFn(item?.[recursionKey], level + 1);
        }

        if (isRemove(item)) return null;

        format(item, level);

        return item;
      })
      .filter((v) => v !== null);
  }

  return recursionFn(recursionData, 1);
}

export function disabledDateAfterToday(current) {
  return current && current >= moment().endOf('day');
}

export function disabledDateBeforerNow(current) {
  return current && current <= moment();
}

export async function getFormItemData(request, propsParams, needToHave = []) {
  const params = typeof propsParams === 'function' ? propsParams() : propsParams || {};
  let isRequestAble = true;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < needToHave.length; i++) {
    const v = params[needToHave[i]];
    if (v == null || (Array.isArray(v) && !v.length)) {
      isRequestAble = false;
      break;
    }
  }
  if (!isRequestAble) return [];
  const [error, result] = await request(params);

  if (error) return [];

  return result ? result.data : [];
}

// m  指定缩略的模式：
// lfit：等比缩放，限制在指定w与h的矩形内的最大图片。
// mfit：等比缩放，延伸出指定w与h的矩形框外的最小图片。
// fill：固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
// pad：固定宽高，缩略填充。
// fixed：固定宽高，强制缩略。
// lfit、mfit、fill、pad、fixed，默认为 lfit。
// w  指定目标缩略图的宽度。  1-4096
// h  指定目标缩略图的高度。  1-4096
// l  指定目标缩略图的最长边。  1-4096
// s  指定目标缩略图的最短边。  1-4096
// limit  指定当目标缩略图大于原图时是否处理。值是 1 表示不处理；值是 0 表示处理。  0/1, 默认是 1
// color  当缩放模式选择为 pad（缩略填充）时，可以选择填充的颜色(默认是白色)参数的填写方式：采用 16 进制颜色码表示，如 00FF00（绿色）。  [000000-FFFFFF]
export const imgFormat = (url, option, option2) => {
  if (typeof url !== 'string' || !(url.includes('.forwe.') || url.includes('xfw-assets.'))) {
    return url;
  }

  const [preurl, search = ''] = url.split('?');
  const $url = search ? `${url}&` : `${preurl}?`;

  // const markPos = url.indexOf('?')
  // const $url = ~markPos ? url.slice(0, markPos) : url
  if (typeof option === 'number') {
    if (typeof option2 === 'number') {
      return `${$url}x-oss-process=image/resize,m_fill,w_${option},h_${option2}`;
    }
    return `${$url}x-oss-process=image/resize,m_fill,s_${option}`;
  }
  return `${$url}x-oss-process=image/resize,${option}`;
};

export function formatImageUploadUrl(urls) {
  return urls.map((file) => {
    if (file.response) {
      let url = file.response.requestUrls[0];
      url = url.includes('?') ? url.split('?')[0] : url;
      file.url = url;
    }
    return file;
  });
}

/**
 * created by zhangbo
 * 合并两个对象（将第二个对象合并到第一个对象），也可用于深度复制
 * @param d 要输出的对象
 * @param b 要合并的对象
 * @param cover 是否覆盖属性
 * @private
 */
export function __merge(d, b, cover) {
  if (b) {
    for (const k in b) {
      if (b[k] === null) continue;
      if (
        typeof b[k] === 'object' &&
        (!d[k] || typeof d[k] === 'object') &&
        !(b[k] instanceof moment)
      ) {
        if (Array.isArray(b[k])) {
          d[k] = d[k] || [];
        } else {
          d[k] = d[k] || {};
        }
        __merge(d[k], b[k], cover);
      } else {
        !(!cover && d.hasOwnProperty(k)) && (d[k] = b[k]);
      }
    }
  }
  return d;
}

const getDefaultType = type => {
  if (type === 'array') {
    return [];
  }
  const types = {
    object: {},
    string: '',
    number: NaN,
    boolean: false
  };
  return types[type] || undefined;
};
/**
 * json 转 字符串
 * @param {*} json 原json字符串
 * @param {*} options 如果是 string 类型，作为默认值；
 * 对象类型，则从中提取 type（用于赋初值） 和 defaultValue（默认值）
 * @returns 字符串
 */
export const fromJSON = (json, options) => {
  const objectOptions = typeof options === 'object' ? options : {};
  const { type = 'string' } = objectOptions;
  const defaultValue = typeof options === 'string'
    ? options : objectOptions.defaultValue || getDefaultType(type);
  let r = '';
  try {
    r = JSON.parse(json);
  } catch (e) {
    r = defaultValue;
  }
  return r;
};
/**
 * 字符串 转 json
 * @param {*} string 字符串
 * @param {*} options 如果是 string 类型，作为默认值；
 * 对象类型，则从中提取defaultValue（默认值）
 * @returns json字符串
 */
export const toJSON = (string, options) => {
  const objectOptions = typeof options === 'object' ? options : {};
  const defaultValue = typeof options === 'string'
    ? options
    : typeof objectOptions.defaultValue === 'string'
      ? objectOptions.defaultValue
      : JSON.stringify('');
  let r = '';
  try {
    r = JSON.stringify(string);
  } catch (e) {
    r = defaultValue;
  }
  return r;
};
