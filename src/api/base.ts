import { request } from '@umijs/max';
import Cookies from 'js-cookie';
import { login } from './login';

export const appId = '102210155';
export const base_info = {
  clientId: sessionStorage.getItem('onlyId'),
  pid: '93784', //产品配置apkid
  channelId: '100000', // 渠道号
  versionCode: 2,
  versionName: '1.0.1.1008',
  model: '33', //手机型号
  locale: 'cn', //语言
  localZone: '480', //时区
  packageName: 'com.novel.fread.webh', //包名
  advertisingAccount: '',
};
/**引力引擎 */
export const geAccessToken = 'hmzcDH9KJr1d0kUTWpxpPVGhjb6g2tfR';

/**数数打点 */
export const initRBIData = {
  appId: '8db20195142b4d5da2d0a1771a5e0a77',
  serverUrl: '//ta-api.zzpeishuang.com/',
};

/**正式域名 */
export const homeUrl =
  process.env.UMI_APP_RUN_ENV == 'prod'
    ? 'https://novel-landing.zzpeishuang.com'
    : 'https://landing.sibenz.cn';

/**重新进行匿名登录 */
async function reLogin() {
  console.log('?????');

  const res = await login({
    androidId: sessionStorage.getItem('onlyId'),
    clientId: sessionStorage.getItem('onlyId'),
  }).catch(() => {
    return {
      data: {
        error_code: 'error',
      },
    };
  });

  if (res.data.error_code == '0') {
    // 匿名登录成功
    Cookies.remove('phoneLogin');
    Cookies.remove('phoneNumber');
  } else {
    // 匿名登录失败，重刷网页

    Cookies.remove('phoneLogin');
    Cookies.remove('userId');
    Cookies.remove('phoneNumber');
    window.location.reload();
  }
}

export function http(value: any) {
  return request(value.url, {
    ...value,
    withCredentials: true,
    requestInterceptors: [
      async function (config: any) {
        const whiteList = ['v2/user/register', 'v2/user/verifycode'];
        if (
          Cookies.get('phoneLogin') &&
          !whiteList.some((e) => config.url.includes(e))
        ) {
          // 手机号获取了验证码，但是没有输入验证码成功登录，凡是没有在白名单的接口发起请求，都要重新走匿名登录
          await reLogin();
        }
        return config;
      },
    ],

    responseInterceptors: [
      async function (response: any) {
        if (
          response.data.code == 601 &&
          process.env.UMI_APP_RUN_ENV != 'local'
        ) {
          await reLogin();
        }
        //  return Promise.reject('error')
        return response;
      },
    ],
  });
}
