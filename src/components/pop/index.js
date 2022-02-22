import { message as antdMessage } from 'antd'

export const message = antdMessage

export const msg = e => {
  if (typeof e === 'string') {
    message.success(e);
    return;
  }
  if (e) {
    const message = e.msg || e.message;
    if (typeof message === 'string') {
      message.success(message);
    } else {
      try {
        const txt = JSON.stringify(e);
        message.success(txt);
      } catch (e) {
        message.success('操作成功');
      }
    }
  }
}

export const errMsg = e => {
  if (typeof e === 'string') {
    message.error(e);
    return;
  }
  if (e) {
    const errorMsg = e.errorMsg || e.message;
    if (typeof errorMsg === 'string') {
      message.error(errorMsg);
    } else {
      try {
        const txt = JSON.stringify(e);
        message.error(txt);
      } catch (e) {
        message.error('数据格式有问题');
      }
    }
  }
}

export default null
