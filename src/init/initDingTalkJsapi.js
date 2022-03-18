import { setJsApiData, requestAuth, initDDConfig } from '@xfw/rc-dingtalk-jsapi';
// import { setJsApiData, initDDConfig, requestAuth } from '@xfw/rc-dingtalk-jsapi'
import config, { setConfig } from '@/config';
import { getApiTicket, userLogin } from '@/services/base';
// import { getApiTicket, getGrantUpload4Approval, userLogin } from '@/services/base'

async function initDingTalkJsapi() {
  const { corpId } = config;

  setJsApiData('corpId', corpId);

  // 设置空间 id
  // setJsApiData('spaceId', async () => {
  //   const [error, result] = await getGrantUpload4Approval()

  //   if (error) return Promise.reject()

  //   return result?.data?.spaceId
  // })

  const authResult = await requestAuth(corpId);
  const loginResult = await userLogin({
    code: authResult.code, corpId
  })
  // const dd = await userLoginH5({
  //   code: authResult.code
  // })
  // console.log('aa', dd)
  const [success, result] = loginResult

  const authMap = {}
  if (success) {
    const { resourceList = [] } = result || {}
    resourceList.forEach(
      ({ resourceId }) => {
        authMap[resourceId] = true
      }
    )
    setConfig({
      token: result.token,
      authMap,
      loginInfo: result
    })
  }
  await initDDConfig({
    // 这里做钉钉授权
    request: async () => {
      const apiTicket = await getApiTicket({
        url: window.location.href,
      }).catch(() => {
        return null;
      });
      if (apiTicket && apiTicket[0]) {
        return apiTicket[1];
      }

      return {};
    },
    jsApiList: ['biz.contact.departmentsPicker', 'biz.contact.complexPicker'],
  });
  return loginResult;
}

export default initDingTalkJsapi;
