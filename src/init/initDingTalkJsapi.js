import { setJsApiData, requestAuth } from '@xfw/rc-dingtalk-jsapi';
// import { setJsApiData, initDDConfig, requestAuth } from '@xfw/rc-dingtalk-jsapi';
import config from '@/config';
import { userLogin } from '@/services/base';
// import { getApiTicket, getGrantUpload4Approval, userLogin } from '@/services/base';

async function initDingTalkJsapi() {
  const { corpId } = config;

  setJsApiData('corpId', corpId);

  // 设置空间 id
  // setJsApiData('spaceId', async () => {
  //   const [error, result] = await getGrantUpload4Approval();

  //   if (error) return Promise.reject();

  //   return result?.data?.spaceId;
  // });

  const authResult = await requestAuth(corpId)
  const loginResult = await userLogin({
    code: authResult.code, corpId, loginType: 1
  })
  return loginResult

  // await initDDConfig({
  //   // 这里做钉钉授权
  //   request: async () => {
  //     const apiTicket = await getApiTicket({
  //       corpId,
  //       jsurl: window.location.href,
  //     }).catch(() => {
  //       return null;
  //     });

  //     if (apiTicket) {
  //       return apiTicket.data;
  //     }

  //     return {};
  //   },
  //   jsApiList: [],
  // });
}

export default initDingTalkJsapi;
