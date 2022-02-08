import { setJsApiData } from '@xfw/rc-dingtalk-jsapi';
import { initDDConfig } from '@xfw/rc-dingtalk-jsapi';
import config from '@/config';

import { getApiTicket, getGrantUpload4Approval } from '@/services/base';

async function initDingTalkJsapi() {
  const { corpId } = config;

  setJsApiData('corpId', corpId);

  // 设置空间 id
  setJsApiData('spaceId', async () => {
    const [error, result] = await getGrantUpload4Approval();

    if (error) return Promise.reject();

    return result?.data?.spaceId;
  });

  await initDDConfig({
    // 这里做钉钉授权
    request: async () => {
      const apiTicket = await getApiTicket({
        corpId,
        jsurl: window.location.href,
      }).catch(() => {
        return null;
      });

      if (apiTicket) {
        return apiTicket.data;
      }

      return {};
    },
    jsApiList: [],
  });
}

export default initDingTalkJsapi;
