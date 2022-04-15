import { setJsApiData, requestAuth, initDDConfig } from '@xfw/rc-dingtalk-jsapi';
// import { setJsApiData, initDDConfig, requestAuth } from '@xfw/rc-dingtalk-jsapi'
import config, { setConfig } from '@/config';
import { getApiTicket, userLogin, userLoginH5, userLoginH5Text } from '@/services/base';
// import { getApiTicket, getGrantUpload4Approval, userLogin } from '@/services/base'
import storage from '@/utils/storage';
import { fromJSON, toJSON } from '@/utils/utils';


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
  // now is use code && session to decide isH5 or not
  // if has error, use config.runType [need set in package scripts] replace
  if (config.code) {
    const stoCode = fromJSON(storage.getItem('CODE')) || '';
    if (stoCode === config.code) {
      const result = fromJSON(storage.getItem('LOGIN_INFO')) || {};
      const authMap = {}
      const { resourceList = [] } = result || {}
      resourceList.forEach(
        ({ resourceId }) => {
          authMap[resourceId] = true
        }
      )
      // inH5 根据环境设置示同的inH5
      setConfig({
        inH5: true,
        token: result.token,
        authMap,
        loginInfo: result
      })
      return [true, result]
    } else {
      storage.setItem('CODE', toJSON(config.code));
      const action = config.code === 'test' ? userLoginH5Text :userLoginH5
      const loginResult = await action({
        code: config.code
      })
      const [success, result] = loginResult
      const authMap = {}
      if (success) {
        storage.setItem('LOGIN_INFO', toJSON(result || {}));
        const { resourceList = [] } = result || {}
        resourceList.forEach(
          ({ resourceId }) => {
            authMap[resourceId] = true
          }
        )
        // inH5 根据环境设置示同的inH5
        setConfig({
          inH5: true,
          token: result.token,
          authMap,
          loginInfo: result
        })
      }
      return loginResult
    }
  } else {
    const loginResult = await userLogin({
      code: authResult.code, corpId
    })
    const [success, result] = loginResult
    const authMap = {}
    if (success) {
      const { resourceList = [] } = result || {}
      resourceList.forEach(
        ({ resourceId }) => {
          authMap[resourceId] = true
        }
      )
      // inH5 根据环境设置示同的inH5
      setConfig({
        inH5: false,
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
}

export default initDingTalkJsapi;
